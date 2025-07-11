import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUserProfile, updateUserRole } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  if (eventType === 'user.created') {
    try {
      await createUserProfile(evt.data);
      console.log('User profile created successfully');
    } catch (error) {
      console.error('Error creating user profile:', error);
      return new Response('Error creating user profile', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          email: evt.data.email_addresses[0]?.email_address || '',
          full_name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
          avatar_url: evt.data.image_url
        })
        .eq('clerk_id', evt.data.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return new Response('Error updating user profile', { status: 500 });
      }

      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      return new Response('Error updating user profile', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', evt.data.id);

      if (error) {
        console.error('Error deleting user profile:', error);
        return new Response('Error deleting user profile', { status: 500 });
      }

      console.log('User profile deleted successfully');
    } catch (error) {
      console.error('Error deleting user profile:', error);
      return new Response('Error deleting user profile', { status: 500 });
    }
  }

  return new Response('', { status: 200 })
} 