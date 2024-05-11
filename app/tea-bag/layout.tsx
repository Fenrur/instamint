"use client"
import React from "react"
import {LoggedLayout} from "@/components/layout/logged-layout"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export const dynamic = "force-dynamic"


interface SearchPageProps {
  children: React.ReactNode,
  params: {
    slug: string
  }
}

export default async function LayoutSearchPage(props: SearchPageProps) {
  const username = props.params.slug;
  const queryClient = new QueryClient();

  return (
      <QueryClientProvider client={queryClient}>
        <LoggedLayout headerText={username} selectedNavigation={"settings"}>
          {props.children}
        </LoggedLayout>
      </QueryClientProvider>

  )
}
