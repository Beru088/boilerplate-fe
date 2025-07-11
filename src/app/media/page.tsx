'use client';

import { useEffect, useState } from 'react';
import MediaList from '@/views/media/MediaList';
import MediaModal from '@/views/media/MediaModal';
import Media from '@/service/types/media';
import { getMedia, deleteMedia } from '@/service/api/media';
import { useAsync } from '@/hooks/useAsync';

const MediaPage = () => {
    const [selected, setSelected] = useState<Media | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const {
        data: media,
        loading,
        error,
        fetch: loadMedia,
        setData,
    } = useAsync<Media[]>(() => getMedia().then((res) => res.data.data));

    useEffect(() => {
        loadMedia();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteMedia(id);
            setData((prev) => prev?.filter((item) => item.id !== id) ?? []);
        } catch (err) {
            console.error(`Failed to delete media ${id}:`, err);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-start items-center">
                <a
                    className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm p-2"
                    href="/"
                    rel="noopener noreferrer">
                    Go Back
                </a>
            </div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Media Library</h1>
                <button
                    onClick={() => {
                        setSelected(null);
                        setIsOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add Media
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p className="text-gray-500">Loading media...</p>
            ) : (
                <MediaList
                    items={media ?? []}
                    onEdit={(item) => {
                        setSelected(item);
                        setIsOpen(true);
                    }}
                    onDelete={handleDelete}
                />
            )}

            <MediaModal
                isOpen={isOpen}
                defaultData={selected}
                onClose={() => setIsOpen(false)}
                onSuccess={async () => {
                    await loadMedia();
                    setIsOpen(false);
                }}
            />
        </div>
    );
};

export default MediaPage;
