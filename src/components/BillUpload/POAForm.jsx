'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { buildPOAPdf, downloadBlob } from '@/lib/buildPOAPdf';

/* ---------- utils ---------- */
const isoDate = (d = new Date()) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const normalizeName = (s = '') => s.trim().replace(/\s+/g, ' ').toLowerCase();
const isValidDateString = (v) => !Number.isNaN(Date.parse(v));

/* ---------- constants ---------- */
const ATTORNEY = {
  org: 'T.H.E.M, LLC',
  address: '123 Business Street, Suite 100\nSpringfield, IL 62701',
  phone: '(123) 456-7891',
  email: 'support@them.com',
};

export default function POAForm({ onSubmit, onBack, isSubmitting, userData }) {
  const expectedUser = userData?.data?.subscriptionDetails?.subscription;
  const plan = userData?.data?.subscriptionDetails?.plan?.planName;
  const expectedName = expectedUser?.customerName;
  const expectedEmail = expectedUser?.customerEmail;

  const today = useMemo(() => isoDate(new Date()), []);
  const defaultEnd = useMemo(() => isoDate(addMonths(new Date(), 12)), []);
  const isStarterPlan = useMemo(
    () =>
      String(plan ?? '')
        .trim()
        .toLowerCase() === 'starter',
    [plan]
  );

  /* ---------- schema ---------- */
  const Schema = useMemo(
    () =>
      z
        .object({
          principalName: z
            .string()
            .trim()
            .min(2, 'Name is too short.')
            .nonempty('Name is required.'),
          dob: z
            .string()
            .nonempty('Date of Birth is required.')
            .refine(isValidDateString, 'Enter a valid date.'),
          address: z
            .string()
            .trim()
            .min(5, 'Address is too short.')
            .nonempty('Address is required.'),
          phone: z
            .string()
            .optional()
            .transform((v) => (v ?? '').trim())
            .refine(
              (v) =>
                v === '' ||
                (v.replace(/\D/g, '').length >= 7 && /^[0-9()\-\s+]*$/.test(v)),
              'Enter a valid phone number (at least 7 digits).'
            ),
          email: z
            .string()
            .trim()
            .nonempty('Email is required.')
            .email('Enter a valid email address.'),
          startDate: z
            .string()
            .nonempty('Start Date is required.')
            .refine(isValidDateString, 'Enter a valid date.'),
          endDate: z
            .string()
            .nonempty('End Date is required.')
            .refine(isValidDateString, 'Enter a valid date.'),
          printedName: z.string().optional(),
          signaturePng: z.string().optional(), // <-- we validate presence via manual error
        })
        .superRefine((vals, ctx) => {
          if (isStarterPlan) {
            if (
              expectedName &&
              normalizeName(vals.principalName) !== normalizeName(expectedName)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  'Your name does not match the account/credit card records.',
                path: ['principalName'],
              });
            }
            if (
              expectedEmail &&
              vals.email.toLowerCase().trim() !==
                String(expectedEmail).toLowerCase().trim()
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  'Your email does not match the account/credit card records.',
                path: ['email'],
              });
            }
          }

          const s = new Date(vals.startDate);
          const e = new Date(vals.endDate);
          if (!(e > s)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'End Date must be after Start Date.',
              path: ['endDate'],
            });
          } else if (e > addMonths(s, 12)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'End Date cannot exceed 12 months from Start Date.',
              path: ['endDate'],
            });
          }
        }),
    [expectedName, expectedEmail, isStarterPlan]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors, // <-- to clear signature error once user draws
    formState: { errors },
  } = useForm({
    defaultValues: {
      principalName: '',
      dob: '',
      address: '',
      phone: '',
      email: '',
      startDate: today,
      endDate: defaultEnd,
      printedName: '',
      signaturePng: '', // keep signature in RHF state
    },
    resolver: zodResolver(Schema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    setValue('startDate', isoDate(new Date()));
    setValue('endDate', isoDate(addMonths(new Date(), 12)));
  }, [setValue]);

  const startDate = watch('startDate');

  /* ---------- signature canvas ---------- */
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [sigTouched, setSigTouched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const w = canvas.parentElement.clientWidth;
      const h = 160;
      const ratio = window.devicePixelRatio || 1;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = w * ratio;
      canvas.height = h * ratio;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches?.[0];
    const x = (t ? t.clientX : e.clientX) - rect.left;
    const y = (t ? t.clientY : e.clientY) - rect.top;
    return { x, y };
  };

  const startDraw = (e) => {
    e.preventDefault();
    setSigTouched(true);
    clearErrors('signaturePng'); // clear error as soon as user draws
    drawing.current = true;
    last.current = getPos(e);
  };
  const moveDraw = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const endDraw = () => (drawing.current = false);

  const clearSignature = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSigTouched(false);
    setValue('signaturePng', ''); // keep form state in sync
  };

  const [submitError, setSubmitError] = useState(null);

  const submitForm = async (values) => {
    if (!sigTouched) {
      setError('signaturePng', {
        type: 'manual',
        message: 'Signature is required.',
      });
      return;
    }

    const signaturePng = canvasRef.current.toDataURL('image/png');
    setValue('signaturePng', signaturePng);

    const payload = {
      ...values,
      signaturePng,
      attorneyInFact: ATTORNEY,
      scopeOfAuthority: [
        'Obtaining and reviewing billing statements, invoices, account balances, and related documentation from hospitals, providers, and insurance companies.',
        'Communicating with providers, billing offices, collection agencies, and insurers.',
        'Negotiating, disputing, or arranging settlement/payment plans for medical bills.',
      ],
      disclaimer:
        'This authorization does NOT extend to medical treatment decisions, clinical records beyond billing, or any non-financial matters.',
      revocation:
        'I may revoke this authorization at any time by providing written notice to T.H.E.M, LLC.',
      executionDate: today,
    };

    try {
      const pdfBlob = await buildPOAPdf(payload);
      const fileName = `POA_${(payload.principalName || 'form').replace(/\s+/g, '_')}.pdf`;
      const pdfFile = new File([pdfBlob], fileName, {
        type: 'application/pdf',
      });

      const res = await onSubmit?.({ ...payload, pdfFile });

      if (res?.success) {
        const dlBlob = new Blob([pdfBlob], {
          type: 'application/octet-stream',
        });
        downloadBlob(dlBlob, fileName);
        clearSignature();
      } else {
        setSubmitError(
          'Server could not start negotiation. PDF was not downloaded.'
        );
      }
    } catch (e) {
      console.error(e);
      setSubmitError('Failed to submit. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="max-h-[70vh] overflow-y-auto pr-2 space-y-3.5"
    >
      <h2 className="text-base font-extrabold tracking-tight">
        LIMITED POWER OF ATTORNEY – MEDICAL BILLING REPRESENTATION
      </h2>

      <section className="mt-4 space-y-3">
        <h3 className="text-base font-semibold">
          Principal (Patient/Customer):
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name:</Label>
            <Input
              placeholder="Full legal name"
              {...register('principalName')}
            />
            {errors.principalName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.principalName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Date of Birth:</Label>
            <Input type="date" {...register('dob')} />
            {errors.dob && (
              <p className="text-xs text-red-600 mt-1">{errors.dob.message}</p>
            )}
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Address:</Label>
            <Textarea
              className="min-h-[70px]"
              placeholder="Street, City, State, ZIP"
              {...register('address')}
            />
            {errors.address && (
              <p className="text-xs text-red-600 mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Phone:</Label>
            <Input placeholder="(555) 123-4567" {...register('phone')} />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Email:</Label>
            <Input placeholder="name@example.com" {...register('email')} />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-2">
        <h3 className="text-base font-semibold">
          Attorney-in-Fact (Representative):
        </h3>
        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Organization</Label>
              <Input readOnly value={ATTORNEY.org} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input readOnly value={ATTORNEY.email} />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input readOnly value={ATTORNEY.phone} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Address</Label>
              <Textarea
                readOnly
                className="min-h-[70px]"
                value={ATTORNEY.address}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="text-base font-semibold">Scope of Authority</h3>
        <p className="text-sm">
          I authorize T.H.E.M, LLC (“Attorney-in-Fact”) to act on my behalf
          solely for the purposes of:
        </p>
        <ul className="text-sm list-[square] list-outside space-y-3 pl-5">
          <li>
            Obtaining and reviewing billing statements, invoices, account
            balances, and related documentation from hospitals, providers, and
            insurance companies.
          </li>
          <li>
            Communicating with providers, billing offices, collection agencies,
            and insurers.
          </li>
          <li>
            Negotiating, disputing, or arranging settlement/payment plans for
            medical bills.
          </li>
        </ul>
        <p className="text-xs text-muted-foreground">
          This authorization does NOT extend to medical treatment decisions,
          clinical records beyond billing, or any non-financial matters.
        </p>
      </section>

      <section className="mt-6 space-y-2">
        <h3 className="text-base font-semibold">Duration</h3>
        <p className="text-sm">
          This Power of Attorney shall remain in effect from:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Start Date:</Label>
            <Input type="date" {...register('startDate')} />
            {errors.startDate && (
              <p className="text-xs text-red-600 mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>End Date:</Label>
            <Input type="date" min={startDate} {...register('endDate')} />
            {errors.endDate && (
              <p className="text-xs text-red-600 mt-1">
                {errors.endDate.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              (not to exceed 12 months from start date)
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-base font-semibold">Revocation</h3>
        <p className="text-sm">
          I may revoke this authorization at any time by providing written
          notice to T.H.E.M, LLC.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="text-base font-semibold">Signatures</h3>
        <div className="space-y-1.5">
          <Label>Principal Signature (Digital):</Label>
          <div
            className="rounded-md border bg-white"
            onMouseDown={startDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={moveDraw}
            onTouchEnd={endDraw}
          >
            <canvas ref={canvasRef} className="w-full h-[160px]" />
          </div>

          {/* keep signature value in RHF + show error here */}
          <input type="hidden" {...register('signaturePng')} />
          {errors.signaturePng && (
            <p className="text-xs text-red-600 mt-1">
              {errors.signaturePng.message}
            </p>
          )}

          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Printed Name:</Label>
            <Input
              {...register('printedName')}
              placeholder="Your printed name"
            />
            {errors.printedName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.printedName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Date:</Label>
            <Input type="date" value={today} readOnly />
          </div>
        </div>
      </section>

      <div className="flex justify-between gap-2 mt-6">
        <Button type="submit">
          {isSubmitting ? 'Submitting…' : 'Agree & Start'}
        </Button>
      </div>

      {submitError && (
        <p className="text-xs text-red-600 mt-2" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
