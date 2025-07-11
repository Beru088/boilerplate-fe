import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Media from '@/service/types/media';
import {
    createMedia,
    updateMedia,
    CreateMediaData,
    CreateMediaSchema,
} from '@/service/api/media';

interface MediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    defaultData: Media | null;
}

export default function MediaModal({
    isOpen,
    onClose,
    onSuccess,
    defaultData,
}: MediaModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateMediaData>({
        resolver: zodResolver(CreateMediaSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        if (defaultData) {
            reset({
                title: defaultData.title,
                description: defaultData.description || '',
            });
        } else {
            reset();
        }

        setFiles([]);
        setPreviewUrls([]);
    }, [defaultData, reset]);

    const onSubmit = async (values: CreateMediaData) => {
        if (!defaultData) {
            await createMedia(values, files);
        } else {
            await updateMedia(defaultData.id, values, files);
        }
        onSuccess();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files ? Array.from(e.target.files) : [];
        setFiles(selected);
        setPreviewUrls(selected.map((file) => URL.createObjectURL(file)));
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
                                    {defaultData ? 'Edit Media' : 'Add Media'}
                                </DialogTitle>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Title
                                        </label>
                                        <input
                                            {...register('title')}
                                            className="w-full border px-3 py-2 rounded"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.title.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            {...register('description')}
                                            className="w-full border px-3 py-2 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {defaultData
                                                ? 'Add More Files (optional)'
                                                : 'Upload Files'}
                                        </label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*"
                                            onChange={handleFileChange}
                                            className="w-full border px-3 py-2 rounded"
                                        />
                                    </div>

                                    {previewUrls.length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                            {previewUrls.map((url, idx) =>
                                                url.includes('video') ||
                                                url.match(
                                                    /\.(mp4|mov|webm)$/i
                                                ) ? (
                                                    <video
                                                        key={idx}
                                                        src={url}
                                                        className="w-16 h-16 rounded object-cover"
                                                        controls
                                                        muted
                                                    />
                                                ) : (
                                                    <img
                                                        key={idx}
                                                        src={url}
                                                        className="w-16 h-16 rounded object-cover"
                                                        alt={`Preview ${idx}`}
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}

                                    <div className="text-right">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
