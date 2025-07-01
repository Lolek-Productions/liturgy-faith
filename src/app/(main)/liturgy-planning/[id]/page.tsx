import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { getLiturgyPlan } from "@/lib/actions/liturgy-planning"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LiturgyPlanDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const plan = await getLiturgyPlan(id)
  
  if (!plan) {
    redirect('/liturgy-planning')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/liturgy-planning">
              <ArrowLeft className="h-4 w-4" />
              Back to Plans
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{plan.title}</h1>
            <p className="text-muted-foreground">
              {new Date(plan.date).toLocaleDateString()} • {plan.liturgy_type}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/liturgy-planning/${plan.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Plan
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prayers</CardTitle>
          </CardHeader>
          <CardContent>
            {plan.prayers && plan.prayers.length > 0 ? (
              <ul className="space-y-2">
                {(plan.prayers as string[]).map((prayer, index) => (
                  <li key={index} className="text-sm border-l-2 border-primary/20 pl-3">
                    {prayer}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No prayers specified</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Readings</CardTitle>
          </CardHeader>
          <CardContent>
            {plan.readings && plan.readings.length > 0 ? (
              <ul className="space-y-2">
                {(plan.readings as string[]).map((reading, index) => (
                  <li key={index} className="text-sm border-l-2 border-primary/20 pl-3">
                    {reading}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No readings specified</p>
            )}
          </CardContent>
        </Card>

        {plan.preface && (
          <Card>
            <CardHeader>
              <CardTitle>Preface</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{plan.preface}</p>
            </CardContent>
          </Card>
        )}

        {plan.special_notes && (
          <Card>
            <CardHeader>
              <CardTitle>Special Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{plan.special_notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}