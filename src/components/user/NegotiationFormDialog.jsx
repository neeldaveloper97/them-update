'use client';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
// import {
//     Input,
//     Label,
//     Button,
//     Textarea,
//     RadioGroup,
//     RadioGroupItem,
// } from '@/components/ui';
import { Calendar, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
    patientName: z.string().min(1, 'Patient name is required'),
    billAmount: z.string().min(1, 'Bill amount is required'),
    justification: z.string().min(1, 'Justification is required'),
    discountAmount: z.string().min(1, 'Discount is required'),
    hospitalName: z.string().min(1, 'Hospital name is required'),
    notes: z.string().optional(),
});

export default function NegotiationFormDialog() {
    const [open, setOpen] = useState(false);
    const [discountType, setDiscountType] = useState('flat');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patientName: 'John Matthews',
            billAmount: '4,200',
            justification: 'No Issues Found in Body Checkup',
            discountAmount: '3,800',
            hospitalName: 'Hopewell Clinic',
            notes: '',
        },
    });

    const onSubmit = (data) => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-org-primary text-white py-1.5 px-2.5 rounded-lg text-sm">
                Check Errors
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Negotiate a Bill</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">

                    <div className="space-y-2.5">
                        <Label htmlFor="patientName">Patient Name</Label>
                        <Input {...register('patientName')} />
                        {errors.patientName && <p className="text-red-500 text-sm mt-1">{errors.patientName.message}</p>}
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="billAmount">Bill Amount</Label>
                        <Input {...register('billAmount')} />
                        {errors.billAmount && <p className="text-red-500 text-sm mt-1">{errors.billAmount.message}</p>}
                    </div>

                    <div className="space-y-2.5">
                        <Label>Negotiation Deadline</Label>
                        <div className="relative">
                            <Input placeholder="Select date" className="pr-10" />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="hospitalName">Hospital Name</Label>
                        <Input {...register('hospitalName')} />
                        {errors.hospitalName && <p className="text-red-500 text-sm mt-1">{errors.hospitalName.message}</p>}
                    </div>

                    <div className="space-y-2.5 col-span-2">
                        <Label>Requested Discount</Label>
                        <div className="flex flex-col justify-start items-start gap-4 mt-1">
                            <RadioGroup value={discountType} onValueChange={setDiscountType} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="percentage" id="percentage" />
                                    <Label htmlFor="percentage">Percentage</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="flat" id="flat" />
                                    <Label htmlFor="flat">Flat</Label>
                                </div>
                            </RadioGroup>
                            <Input {...register('discountAmount')} className="w-full" />
                        </div>
                        {errors.discountAmount && <p className="text-red-500 text-sm mt-1">{errors.discountAmount.message}</p>}
                    </div>

                    <div className="space-y-2.5 col-span-2">
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Input {...register('notes')} placeholder="Any additional notes" />
                    </div>

                    <div className="space-y-2.5 col-span-2">
                        <Label className="" htmlFor="justification">Justification</Label>
                        <Textarea {...register('justification')} placeholder="Enter reason for negotiation" />
                        {errors.justification && <p className="text-red-500 text-sm mt-1">{errors.justification.message}</p>}
                    </div>

                    <div className="lg:col-span-2 flex justify-end mt-4">
                        <Button type="submit" className="bg-org-primary text-white">Edit</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
