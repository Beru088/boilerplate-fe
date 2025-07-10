'use client';

import { AppConfig } from '@/configs/api';
import Media from '@/service/types/media';

interface MediaListProps {
    items: Media[];
    onEdit: (media: Media) => void;
    onDelete: (id: number) => void;
}

const MediaList = ({ items, onEdit, onDelete }: MediaListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items && items.length > 0 ? (
                items.map((media) => (
                    <div key={media.id} className="border p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">
                            {media.title}
                        </h2>
                        {media.description && (
                            <p className="text-sm text-gray-600 mb-2">
                                {media.description}
                            </p>
                        )}
                        <div className="flex gap-2 mb-4 overflow-x-auto">
                            {media.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                                    {item.type === 'video' ||
                                    item.url.match(/\.(mp4|webm|mov)$/i) ? (
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover"
                                            controls
                                            muted
                                        />
                                    ) : (
                                        <img
                                            src={`http://localhost:8000/uploads/803801ae-1a8f-48ab-a373-1e613352556c.jpg`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => onEdit(media)}
                                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded">
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(media.id)}
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-400 italic mt-2">
                    No media items.
                </p>
            )}
        </div>
    );
};

export default MediaList;
