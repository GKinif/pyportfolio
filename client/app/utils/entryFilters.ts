import {GetBudgetEntriesParams} from "~/services/budgets";

export const getEntrySearchParams = (searchParams: URLSearchParams): GetBudgetEntriesParams => {
  return {
      amount__lte: searchParams.get("amount__lte") ?? undefined,
      amount__gte: searchParams.get("amount__gte") ?? undefined,
      date: searchParams.get("date") ?? undefined,
      date__lte: searchParams.get("date__lte") ?? undefined,
      date__gte: searchParams.get("date__gte") ?? undefined,
      date__year: searchParams.get("date__year") ?? undefined,
      date__month: searchParams.get("date__month") ?? undefined,
      description: searchParams.get("description") ?? undefined,
      order: searchParams.get("order") ?? undefined,
    }
}