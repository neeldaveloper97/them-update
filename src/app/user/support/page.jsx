'use client';

import { useDispatch, useSelector } from 'react-redux';
import { submitContactForm } from '@/store/slices/contactSlice';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const Page = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.contact);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    dispatch(submitContactForm(data));
    reset();
  };

  return (
    <>
      <div className="flex justify-center bg-image_profile bg-org-primary rounded-3xl h-52"></div>
      <div className="lg:p-5 bg-white rounded-3xl max-w-4xl w-full mx-auto -mt-24 shadow-1 overflow-hidden">
        <div className="border border-primary-light-100 p-7 rounded-3xl">
          <h2 className="text-center font-bold text-org-primary-dark text-2xl">
            Contact Us
          </h2>
          <div className="pt-14">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                <div className="flex flex-col">
                  <label className="pb-2.5 text-org-primary-dark">
                    First name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    {...register('firstName')}
                    className="py-3 px-3.5 border border-[#E5E7EC] rounded-lg"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="pb-2.5 text-org-primary-dark">
                    Last name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    {...register('lastName')}
                    className="py-3 px-3.5 border border-[#E5E7EC] rounded-lg"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="pb-2.5 text-org-primary-dark">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register('email')}
                  className="py-3 px-3.5 border border-[#E5E7EC] rounded-lg"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="pb-2.5 text-org-primary-dark">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Add Company name"
                  {...register('company')}
                  className="py-3 px-3.5 border border-[#E5E7EC] rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label className="pb-2.5 text-org-primary-dark">Message</label>
                <textarea
                  placeholder="How can we help you ?"
                  {...register('message')}
                  className="py-3 px-3.5 border border-[#E5E7EC] rounded-lg"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 bg-primary-color text-white rounded-lg px-12 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
