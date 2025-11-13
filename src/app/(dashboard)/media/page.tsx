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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Folder,
  FolderPlus,
  Image as ImageIcon,
  MoreVertical,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState, useMemo } from 'react';
import Link from 'next/link';

type FileItem = {
  id: string;
  type: 'folder' | 'image';
  name: string;
  url?: string;
  parentId?: string | null;
};

const initialFiles: FileItem[] = [
  { id: 'folder-1', type: 'folder', name: 'User Avatars', parentId: null },
  { id: 'folder-2', type: 'folder', name: 'Product Images', parentId: null },
  {
    id: 'img-1',
    type: 'image',
    name: 'header-background.jpg',
    url: 'https://picsum.photos/seed/media1/400/300',
    parentId: null,
  },
  {
    id: 'img-2',
    type: 'image',
    name: 'promo-banner.png',
    url: 'https://picsum.photos/seed/media2/400/300',
    parentId: 'folder-2',
  },
  {
    id: 'img-3',
    type: 'image',
    name: 'email-template-hero.gif',
    url: 'https://picsum.photos/seed/media3/400/300',
    parentId: 'folder-2',
  },
  { id: 'folder-3', type: 'folder', name: 'Campaign Assets', parentId: null },
  {
    id: 'img-4',
    type: 'image',
    name: 'social-post-1.jpg',
    url: 'https://picsum.photos/seed/media4/400/300',
    parentId: null,
  },
];

export default function MediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [fileToRename, setFileToRename] = useState<FileItem | null>(null);
  const [newName, setNewName] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles && uploadedFiles.length > 0) {
      console.log('Selected files:', uploadedFiles);
      // Here you would typically handle the file upload to R2/S3
    }
  };

  const handleRenameClick = (file: FileItem) => {
    setFileToRename(file);
    setNewName(file.name);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileToRename && newName.trim()) {
      setFiles(
        files.map((f) =>
          f.id === fileToRename.id ? { ...f, name: newName.trim() } : f
        )
      );
      setRenameDialogOpen(false);
      setFileToRename(null);
      setNewName('');
    }
  };
  
  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
        const newFolder: FileItem = {
            id: `folder-${Date.now()}`,
            name: newFolderName.trim(),
            type: 'folder',
            parentId: currentFolderId,
        };
        setFiles([...files, newFolder]);
        setCreateFolderOpen(false);
        setNewFolderName('');
    }
  };


  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleBreadcrumbClick = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };
  
  const breadcrumbPath = useMemo(() => {
    const path = [];
    let currentId = currentFolderId;
    while (currentId) {
      const folder = files.find((f) => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return path;
  }, [currentFolderId, files]);
  
  const displayedFiles = useMemo(() => {
    return files.filter(file => file.parentId === currentFolderId);
  }, [files, currentFolderId]);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images and media assets.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCreateFolderOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Folder
            </Button>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
        </div>
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
                <BreadcrumbLink onClick={() => handleBreadcrumbClick(null)} className="cursor-pointer">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbPath.map((folder, index) => (
                <React.Fragment key={folder.id}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    {index === breadcrumbPath.length - 1 ? (
                        <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink onClick={() => handleBreadcrumbClick(folder.id)} className="cursor-pointer">
                        {folder.name}
                        </BreadcrumbLink>
                    )}
                    </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {displayedFiles.map((file) => (
              <Card
                key={file.id}
                className="group relative overflow-hidden transition-shadow hover:shadow-md"
                onClick={file.type === 'folder' ? () => handleFolderClick(file.id) : undefined}
              >
                <div className={`flex aspect-square w-full items-center justify-center bg-muted ${file.type === 'folder' ? 'cursor-pointer' : ''}`}>
                  {file.type === 'image' && file.url ? (
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
                <div className="absolute right-1 top-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem onClick={() => handleRenameClick(file)}>
                        Rename
                      </DropdownMenuItem>
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

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleRenameSubmit}>
            <DialogHeader>
              <DialogTitle>Rename Item</DialogTitle>
              <DialogDescription>
                Enter a new name for &quot;{fileToRename?.name}&quot;.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="new-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateFolderSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter a name for your new folder.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="folder-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Marketing Assets"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Folder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
