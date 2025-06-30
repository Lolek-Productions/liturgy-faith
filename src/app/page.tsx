import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Plus, 
  FileText, 
  Globe, 
  Shield, 
  Clock, 
  Users, 
  Copy,
  Sparkles,
  Church,
  Heart,
  BookOpen,
  Menu
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Church className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Petitions</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="px-4 py-2">
            <Church className="h-4 w-4 mr-2" />
            For Catholic Communities
          </Badge>
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          Streamline Your Church
          <span className="text-primary block">Petition Creation</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Generate beautifully formatted liturgical petitions in minutes. Save time, reduce errors, 
          and focus on what matters most - serving your community with reverence and care.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/petitions/create">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Petition
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <Link href="/petitions">
              <FileText className="h-5 w-5 mr-2" />
              View Examples
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Everything You Need for Perfect Petitions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intelligent system understands traditional Catholic liturgy and generates 
            properly formatted petitions that honor sacred traditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                Smart Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Input your community context and watch as traditional Catholic petitions 
                are automatically generated with proper liturgical language and structure.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Sacrament celebrations</li>
                <li>• Memorial prayers</li>
                <li>• Healing intentions</li>
                <li>• Special requests</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                Multi-Language Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Serve diverse communities with petitions in multiple languages, 
                each maintaining authentic liturgical traditions and proper formatting.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">English</Badge>
                <Badge variant="outline">Spanish</Badge>
                <Badge variant="outline">French</Badge>
                <Badge variant="outline">Latin</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                Secure & Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your community&apos;s sensitive information is protected with enterprise-grade 
                security. Each user can only access their own petitions.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• End-to-end encryption</li>
                <li>• User isolation</li>
                <li>• Secure authentication</li>
                <li>• GDPR compliant</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                Save Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                What once took 30+ minutes of careful writing now takes just 3 minutes. 
                Spend more time on pastoral care, less on administrative tasks.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium text-center">
                  30 min → 3 min
                  <span className="block text-xs text-muted-foreground mt-1">
                    90% time savings
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Copy className="h-6 w-6 text-primary" />
                </div>
                Easy Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Organize, copy, and reuse petitions effortlessly. Build a library of 
                your community&apos;s prayer intentions for future reference.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• One-click copying</li>
                <li>• Search and filter</li>
                <li>• Date organization</li>
                <li>• Template creation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                Community Focused
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Built specifically for Catholic communities by understanding the unique 
                needs of parish life and liturgical celebrations.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Liturgical accuracy</li>
                <li>• Sacred traditions</li>
                <li>• Pastoral sensitivity</li>
                <li>• Community care</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Simple Three-Step Process</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Creating professional liturgical petitions has never been easier. 
            Follow these simple steps to generate beautiful, formatted prayers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Input Community Context</h3>
              <p className="text-muted-foreground">
                Enter information about sacraments received, community members needing prayers, 
                recent deaths, and special intentions through our guided form.
              </p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Generate Petitions</h3>
              <p className="text-muted-foreground">
                Our intelligent system creates properly formatted liturgical petitions 
                following traditional Catholic prayer structures and language.
              </p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Copy & Use</h3>
              <p className="text-muted-foreground">
                Copy the generated content with one click and use it directly in your 
                Mass, prayer service, or other liturgical celebrations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Example Output */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">See What You&apos;ll Create</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here&apos;s an example of the beautifully formatted petitions our system generates.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sample Generated Petition
              </CardTitle>
              <Badge variant="secondary">English</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-6 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
{`Petitions - December 15/16, 2024

For all bishops, the successors of the Apostles, may the Holy Spirit protect and guide them, let us pray to the Lord.

For government leaders, may God give them wisdom to work for justice and to protect the lives of the innocent, let us pray to the Lord.

For those who do not know Christ, may the Holy Spirit bring them to recognize his love and goodness, let us pray to the Lord.

For this community gathered here, may Christ grant us strength to proclaim him boldly, let us pray to the Lord.

For all those who are praying for healing, especially Maria Santos, John Thompson, may they receive God's strength and grace, let us pray to the Lord.

For all who have died, especially Father Michael O'Brien, Dorothy Martinez, may they rejoice with the angels and saints in the presence of God the Father, let us pray to the Lord.

For the intentions that we hold in the silence of our hearts (PAUSE 2-3 seconds), and for those written in our book of intentions, let us pray to the Lord.`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div id="pricing" className="bg-muted/50 rounded-2xl p-12 text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ready to Transform Your Petition Process?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join parishes worldwide who are saving time and creating more meaningful 
            liturgical experiences with our petition management system.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/signup">
              <Heart className="h-5 w-5 mr-2" />
              Start Free Today
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <Link href="/petitions/create">
              <Plus className="h-5 w-5 mr-2" />
              Try Without Signing Up
            </Link>
          </Button>
        </div>
      </div>
      </div>
    </div>
  )
}