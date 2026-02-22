"use server";

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// One-time admin setup route — DELETE THIS FILE after creating admin
export async function GET() {
  const supabase = await createClient();

  const email = "admin@gemmarket.com";
  const password = "123456";

  // Step 1: Sign up the admin user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: "Admin",
        business_name: "GemMarket Admin",
      },
    },
  });

  if (signUpError) {
    // If user already exists, try to get them
    if (signUpError.message.includes("already registered")) {
      // Update existing profile to admin
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        return NextResponse.json(
          { error: "User exists but cannot sign in: " + signInError.message },
          { status: 400 }
        );
      }

      if (signInData.user) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "admin", approval_status: "approved" })
          .eq("id", signInData.user.id);

        if (updateError) {
          return NextResponse.json(
            { error: "Failed to update profile: " + updateError.message },
            { status: 500 }
          );
        }

        await supabase.auth.signOut();

        return NextResponse.json({
          success: true,
          message: "Existing user promoted to admin",
          email,
        });
      }
    }

    return NextResponse.json(
      { error: signUpError.message },
      { status: 400 }
    );
  }

  // Step 2: Update profile to admin role
  if (signUpData.user) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: "admin", approval_status: "approved" })
      .eq("id", signUpData.user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "User created but failed to set admin: " + updateError.message },
        { status: 500 }
      );
    }
  }

  await supabase.auth.signOut();

  return NextResponse.json({
    success: true,
    message: "Admin account created successfully!",
    credentials: {
      email,
      password,
      loginUrl: "/seller/login",
      adminUrl: "/admin",
    },
    note: "DELETE the /src/app/api/setup-admin/ route after setup!",
  });
}
