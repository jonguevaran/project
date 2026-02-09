"use client";
import dynamic from 'next/dynamic';

const UploadPhotos = dynamic(() => import('@/components/UploadPhotos'), { ssr: false });

export default function UploadPhotosClient({ packId }: { packId: string }) {
  return <UploadPhotos packId={packId} />;
}
