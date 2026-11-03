"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { isAdminAuthorization } from "@/lib/admin/auth";
import { deleteQuestion } from "@/lib/ai/questions";

/** Deletes one stored question. The proxy already checked auth; check again. */
export async function deleteQuestionAction(formData: FormData) {
  const authorization = (await headers()).get("authorization");
  if (!isAdminAuthorization(authorization)) throw new Error("Unauthorized");
  const id = z.uuid().parse(formData.get("id"));
  await deleteQuestion(id);
  revalidatePath("/admin");
}
