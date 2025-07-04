'use client';
import { useEffect, useState } from 'react';
import { getMedia, Media } from '@/types/media';
import MediaList from '@/views/media/MediaList';
import MediaModal from '@/views/media/MediaModal';

const MediaPage = () => {
    const [media, setMedia] = useState<Media[]>([]);
    const [selected, setSelected] = useState<Media | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const loadData = async () => {
        const res = await getMedia();
        setMedia(res);
    };

    useEffect(() => {
        loadData();
    }, []);

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
                onEdit={(media) => {
                    setSelected(media);
                    setIsOpen(true);
                }}
                onDelete={loadData}
                openModal={() => setIsOpen(true)}
            />

            <MediaModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={() => {
                    setIsOpen(false);
                    loadData();
                }}
                defaultData={selected}
            />
        </div>
    );
};

export default MediaPage;
