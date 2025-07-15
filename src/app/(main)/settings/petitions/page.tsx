import { PageContainer } from '@/components/page-container';
import { getPetitionContexts, ensureDefaultContexts } from '@/lib/actions/petition-contexts';
import PetitionTemplateList from './petition-template-list';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function PetitionSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Ensure initial contexts are created
  await ensureDefaultContexts();
  const templates = await getPetitionContexts();

  return (
    <PageContainer
      title="Petition Templates"
      description="Manage petition templates for your liturgical celebrations. Create custom contexts as needed."
      maxWidth="6xl"
    >
      <PetitionTemplateList templates={templates} />
    </PageContainer>
  );
}