'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Folder,
  Image as ImageIcon,
  MoreVertical,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import React, { useRef } from 'react';

const mockFiles = [
  { id: 'folder-1', type: 'folder', name: 'User Avatars' },
  { id: 'folder-2', type: 'folder', name: 'Product Images' },
  {
    id: 'img-1',
    type: 'image',
    name: 'header-background.jpg',
    url: 'https://picsum.photos/seed/media1/400/300',
  },
  {
    id: 'img-2',
    type: 'image',
    name: 'promo-banner.png',
    url: 'https://picsum.photos/seed/media2/400/300',
  },
  {
    id: 'img-3',
    type: 'image',
    name: 'email-template-hero.gif',
    url: 'https://picsum.photos/seed/media3/400/300',
  },
  { id: 'folder-3', type: 'folder', name: 'Campaign Assets' },
  {
    id: 'img-4',
    type: 'image',
    name: 'social-post-1.jpg',
    url: 'https://picsum.photos/seed/media4/400/300',
  },
];

export default function MediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Selected files:', files);
      // Here you would typically handle the file upload to R2/S3
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images and media assets.
          </p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*"
          multiple
        />
      </div>

      <Card>
        <CardHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/media">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All Files</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mockFiles.map((file) => (
              <Card
                key={file.id}
                className="group relative overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="aspect-square w-full bg-muted flex items-center justify-center">
                  {file.type === 'image' ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Folder className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute top-1 right-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem>Move</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="p-2">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
