"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Trash2, Search, FileText, Edit, Plus } from "lucide-react";
import { deletePetitionContext, PetitionContextTemplate } from '@/lib/actions/petition-contexts';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PetitionTemplateListProps {
  templates: PetitionContextTemplate[];
}

export default function PetitionTemplateList({ templates }: PetitionTemplateListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const filteredTemplates = useMemo(() => {
    let filtered = templates;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [templates, searchTerm]);

  const openDeleteDialog = (templateId: string) => {
    setTemplateToDelete(templateId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;
    
    setIsDeleting(true);
    
    try {
      await deletePetitionContext(templateToDelete);
      toast.success("Template deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete template. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTemplateByTitle = (templateId: string) => {
    return templates.find(t => t.id === templateId);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/settings/petitions/create">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Link>
          </Button>
        </div>
      </div>

      {/* Templates Table */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? "No templates found matching your search." : "No templates yet. Create your first template!"}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-4">
              <Link href="/settings/petitions/create">Create Template</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Description</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Created</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Updated</th>
                <th className="text-center p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="border-b hover:bg-muted/25 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{template.title}</span>
                      <span className="text-sm text-muted-foreground md:hidden">
                        {template.description}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {template.description || "No description"}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(template.created_at)}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(template.updated_at)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={`/settings/petitions/${template.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(template.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{getTemplateByTitle(templateToDelete || '')?.title}&quot;? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}