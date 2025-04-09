/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export function apiResponseOK(code: number, body: any) {
  return NextResponse.json(body, {
    status: code,
  });
}

export function apiResponseErr(code: number, body: any) {
  return NextResponse.json(
    { error: body },
    {
      status: code,
    }
  );
}
