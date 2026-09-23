import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { api } from '@/api';
import { Button, Icon, Seo, TextField } from '@/components/ui';
import { AuthShell } from './AuthShell';

const schema = z.object({ email: z.string().trim().email('Enter a valid email address.') });

export default function ForgotPassword() {
  const [sentTo, setSentTo] = useState<string>();
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  return (
    <AuthShell title="Reset your password" intro="Enter your account email and we’ll send a reset link.">
      <Seo title="Reset password" />
      {sentTo ? (
        <div role="status" className="rounded-card border border-line bg-surface p-6">
          <Icon name="mail" size={28} className="text-success" />
          <p className="mt-3 font-semibold">Check your inbox</p>
          <p className="mt-1 text-sm text-muted">
            If an account exists for {sentTo}, a reset link is on its way. (Demo: no email is sent. The demo account password is listed on the sign-in page.)
          </p>
          <Link to="/login" className="mt-4 inline-block font-semibold">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form noValidate className="space-y-5" onSubmit={handleSubmit(async (v) => setSentTo((await api.auth.requestPasswordReset(v.email)).email))}>
          <TextField label="Email" type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
          <Button type="submit" size="lg" className="w-full" loading={formState.isSubmitting}>
            Send reset link
          </Button>
          <p className="text-center text-sm">
            <Link to="/login">Back to sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
