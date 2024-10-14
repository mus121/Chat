'use server'

import { cookies } from 'next/headers'
 
export async function cook() {
  const cookieStore = await cookies()
  const theme = await cookieStore.get('authToken')
  return theme
}

export async function email() {
    const userEmail = await cookies();
    const user = await userEmail.get('email');
    return user
}