"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FormField } from '@/components/form-field';
import { Save, Loader2 } from "lucide-react";
import { createPetitionContext, updatePetitionContext, PetitionContextTemplate } from '@/lib/actions/petition-contexts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PetitionTemplateFormProps {
  template?: PetitionContextTemplate;
  templateSettings?: string;
}

export default function PetitionTemplateForm({ template, templateSettings }: PetitionTemplateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: template?.title || '',
    description: template?.description || '',
    context: template?.context || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (template) {
        // Update existing template
        await updatePetitionContext({
          id: template.id,
          title: formData.title,
          description: formData.description,
          context: formData.context
        });
        
        toast.success('Template updated successfully');
      } else {
        // Create new template
        const newTemplate = await createPetitionContext({
          title: formData.title,
          description: formData.description,
          context: formData.context
        });
        
        toast.success('Template created successfully');
        router.push(`/settings/petitions/${newTemplate.id}`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            id="title"
            label="Template Title"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="e.g., Sunday Mass (English)"
            required
          />
          
          <FormField
            id="description"
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Brief description of when to use this template"
          />
          
          <FormField
            id="context"
            label="Context Information"
            inputType="textarea"
            value={formData.context}
            onChange={(value) => setFormData({ ...formData, context: value })}
            placeholder="Any additional context or instructions for using this template..."
            rows={4}
          />
        </CardContent>
      </Card>


      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {template ? 'Update Template' : 'Create Template'}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/settings/petitions')}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}