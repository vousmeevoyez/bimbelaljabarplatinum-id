// src/app/(marketing)/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";

// ---------- Types ----------
export type Course = {
  id: string;
  title: string;
  free: boolean;
  price: number; // 0 for free
  longUrl: string;
};

export type School = {
  id: string;
  name: string;
  description?: string;
  courses: Course[];
};

// ---------- Mock Data (static, server-friendly) ----------
const SCHOOLS: School[] = [
  {
    id: "s1",
    name: "School A",
    description: "Project-based learning with a focus on web development.",
    courses: [
      { id: "c1", title: "Intro to HTML & CSS", free: true, price: 0, longUrl: "https://example.com/courses/html-css" },
      { id: "c2", title: "JavaScript for Beginners", free: false, price: 49, longUrl: "https://example.com/courses/js-beginners" },
      { id: "c3", title: "React Fundamentals", free: false, price: 79, longUrl: "https://example.com/courses/react-fundamentals" },
    ],
  },
  {
    id: "s2",
    name: "School B",
    description: "Affordable micro-courses for educators and students.",
    courses: [
      { id: "c4", title: "AI Literacy (Free)", free: true, price: 0, longUrl: "https://example.com/courses/ai-literacy" },
      { id: "c5", title: "Prompt Engineering", free: false, price: 99, longUrl: "https://example.com/courses/prompt-engineering" },
    ],
  },
];

// Short-link map. In a real app you'd look this up in a DB.
// Code -> { schoolId, courseId }
const SHORT_LINKS: Record<string, { schoolId: string; courseId: string }> = {
  html01: { schoolId: "s1", courseId: "c1" },
  js49: { schoolId: "s1", courseId: "c2" },
  react79: { schoolId: "s1", courseId: "c3" },
  ai0: { schoolId: "s2", courseId: "c4" },
  prompt99: { schoolId: "s2", courseId: "c5" },
};

// ---------- SEO ----------
export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

// ---------- Helpers (pure, server-safe) ----------
function byId<T extends { id: string }>(xs: T[], id?: string | null): T | undefined {
  return id ? xs.find((x) => x.id === id) : undefined;
}

function resolveShort(code?: string | null): { school?: School; course?: Course } {
  if (!code) return {};
  const hit = SHORT_LINKS[code];
  if (!hit) return {};
  const school = byId(SCHOOLS, hit.schoolId);
  const course = school?.courses.find((c) => c.id === hit.courseId);
  return { school, course };
}

// ---------- Page (React Server Component) ----------
// Supports hierarchical navigation via searchParams:
//   /?school=s1              -> list courses for School A
//   /?school=s1&course=c2    -> course detail for JS Beginners
//   /?code=html01            -> resolve a short code and show course detail
export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const qp = (k: string) =>
    Array.isArray(sp?.[k]) ? (sp?.[k] as string[])[0] : (sp?.[k] as string | undefined);

  const schoolId = qp("school");
  const courseId = qp("course");
  const code = qp("code");

  const resolved = resolveShort(code);
  const activeSchool = resolved.school ?? byId(SCHOOLS, schoolId);
  const activeCourse = resolved.course ?? activeSchool?.courses.find((c) => c.id === (courseId ?? ""));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <Separator />

      {/* --- Level 1: Schools list --- */}
      {!activeSchool && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCHOOLS.map((school) => (
            <Card key={school.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{school.name}</span>
                  <Badge variant="secondary">{school.courses.length} courses</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{school.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={{ pathname: "/", query: { school: school.id } }}>View courses</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      )}

      {/* --- Level 2: Courses in a school --- */}
      {activeSchool && !activeCourse && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/">← Back to schools</Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              Open by short code: append <code>?code=html01</code> (etc.) to the URL.
            </div>
          </div>
          <h2 className="text-xl font-medium">{activeSchool.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSchool.courses.map((course) => (
              <Card key={course.id} className="hover:shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{course.title}</span>
                    {course.free ? <Badge>Free</Badge> : <Badge variant="destructive">Paid</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{activeSchool.name}</div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button asChild>
                    <Link href={{ pathname: "/", query: { school: activeSchool.id, course: course.id } }}>
                      Details
                    </Link>
                  </Button>
                  {!course.free && <span className="text-xs text-muted-foreground">${course.price}</span>}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* --- Level 3: Course detail --- */}
      {activeSchool && activeCourse && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href={{ pathname: "/", query: { school: activeSchool.id } }}>
                ← Back to {activeSchool.name}
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              Short code examples: <code>html01</code>, <code>js49</code>, <code>react79</code>,{" "}
              <code>ai0</code>, <code>prompt99</code>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeCourse.title}
                {activeCourse.free ? (
                  <Badge className="ml-1">Free</Badge>
                ) : (
                  <Badge variant="destructive" className="ml-1">
                    ${activeCourse.price}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                After sign up and checkout (mock), you get access to the course. For demo purposes,
                links below are public.
              </p>
              <div className="text-sm">
                <span className="font-medium">School:</span> {activeSchool.name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Course link:</span>{" "}
                <a className="underline" href={activeCourse.longUrl} target="_blank" rel="noreferrer">
                  {activeCourse.longUrl}
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              {activeCourse.free ? (
                <Button asChild>
                  <Link href={{ pathname: "/signup", query: { next: activeCourse.longUrl } }}>
                    Sign up & enroll (free)
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={{ pathname: "/checkout", query: { course: activeCourse.id } }}>
                    Checkout & enroll
                  </Link>
                </Button>
              )}
              <div className="text-xs text-muted-foreground">Requires account to pay.</div>
            </CardFooter>
          </Card>
        </section>
      )}
    </main>
  );
}

