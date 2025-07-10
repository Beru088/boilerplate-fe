'use client';

import { useEffect, useState } from 'react';
import MediaList from '@/views/media/MediaList';
import MediaModal from '@/views/media/MediaModal';
import Media from '@/service/types/media';
import { getMedia, deleteMedia } from '@/service/api/media';

const MediaPage = () => {
    const [media, setMedia] = useState<Media[]>([]);
    const [selected, setSelected] = useState<Media | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const loadData = async () => {
        try {
            const response = await getMedia();
            setMedia(response.data.data);
        } catch (err) {
            console.error('Failed to load media:', err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteMedia(id);
            setMedia((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error(`Failed to delete media ${id}:`, err);
        }
    };

    return (
        <div className="p-6">
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

            <MediaList
                items={media}
                onEdit={(item) => {
                    setSelected(item);
                    setIsOpen(true);
                }}
                onDelete={handleDelete}
            />

            <MediaModal
                isOpen={isOpen}
                defaultData={selected}
                onClose={() => setIsOpen(false)}
                onSuccess={async () => {
                    setIsOpen(false);
                    await loadData();
                }}
            />
        </div>
    );
};

export default MediaPage;
