"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// --- Configuration ---
const THEME_COLOR = "#046c4e";
const THEME_LIGHT = "#def7ec";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values) {
    // API Simulation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-white font-sans text-slate-900">
      {/* ---------------- LEFT SIDE: Islamic Pattern ---------------- */}
      <div
        className="relative hidden h-full flex-col p-10 text-white lg:flex"
        style={{ backgroundColor: THEME_COLOR }}
      >
        {/* CSS Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${THEME_LIGHT} 2px, transparent 2px), radial-gradient(${THEME_LIGHT} 2px, transparent 2px)`,
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        />

        {/* Logo */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="relative h-12 w-12 bg-white/10 rounded-full p-2 flex items-center justify-center border border-white/20">
            <Image
              src="/assets/images/hadhi-logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Majidhul Haadhi
          </span>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center relative z-20">
          <div className="space-y-4 text-center max-w-md">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/10 mb-4 backdrop-blur-sm border border-white/20">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              Account Recovery
            </h2>
            <p className="text-emerald-100/80 text-lg">
              Don't worry, we'll help you get back on track securely.
            </p>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="relative z-20 mt-auto border-t border-emerald-400/30 pt-6">
          <blockquote className="space-y-2">
            <p className="text-lg italic text-emerald-50">
              &ldquo;Indeed, with hardship [will be] ease.&rdquo;
            </p>
            <footer className="text-sm font-semibold text-emerald-200">
              Surah Ash-Sharh 94:6
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ---------------- RIGHT SIDE: Form ---------------- */}
      <div className="flex items-center justify-center p-8 bg-slate-50/50">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isSubmitted ? "Check your email" : "Forgot password?"}
            </h1>
            <p className="text-sm text-slate-500">
              {isSubmitted
                ? `We have sent a password reset link to ${form.getValues(
                    "email"
                  )}`
                : "No worries, we'll send you reset instructions."}
            </p>
          </div>

          {!isSubmitted ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="name@example.com"
                            {...field}
                            className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-offset-0 transition-all"
                            style={{
                              "--tw-ring-color": THEME_COLOR,
                              borderColor: "inherit",
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 text-white font-bold text-base shadow-sm hover:opacity-90 transition-all"
                  style={{ backgroundColor: THEME_COLOR }}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="flex justify-center my-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-600 animate-in zoom-in duration-300" />
              </div>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                try another email
              </Button>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-semibold hover:underline"
              style={{ color: THEME_COLOR }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}