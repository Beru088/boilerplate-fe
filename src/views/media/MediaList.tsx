'use client';
import { deleteMedia, Media } from '@/types/media';

interface MediaListProps {
    items: Media[];
    onEdit: (media: Media) => void;
    onDelete: () => void;
    openModal: () => void;
}

const MediaList = ({ items, onEdit, onDelete }: MediaListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((media) => (
                <div key={media.id} className="border p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">
                        {media.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                        {media.description}
                    </p>

                    {Array.isArray(media.items) && media.items.length > 0 ? (
                        <div className="flex gap-2">
                            {media.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-16 h-16 overflow-hidden">
                                    {item.type === 'image' ? (
                                        <img
                                            src={item.url}
                                            alt=""
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover"
                                            controls
                                            muted
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic mt-2">
                            No media items.
                        </p>
                    )}

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => onEdit(media)}
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded">
                            Edit
                        </button>
                        <button
                            onClick={async () => {
                                await deleteMedia(media.id);
                                onDelete();
                            }}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MediaList;
