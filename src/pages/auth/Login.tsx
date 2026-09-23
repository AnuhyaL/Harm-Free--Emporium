import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { api, DEMO_CREDENTIALS } from '@/api';
import { Button, FormError, Seo, TextField } from '@/components/ui';
import { useAuth, useUI } from '@/store';
import { AuthShell } from './AuthShell';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});
type Values = z.infer<typeof schema>;

/** Only allow same-site relative redirects. */
export const safeNext = (next: string | null) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '/account');

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);
  const toast = useUI((s) => s.toast);
  const [error, setError] = useState<string>();
  const { register, handleSubmit, setValue, formState } = useForm<Values>({ resolver: zodResolver(schema) });
  const next = safeNext(params.get('next'));

  return (
    <AuthShell
      title="Welcome back"
      intro={
        <>
          New here? <Link to={`/signup${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`}>Create an account</Link> and get 200 welcome points.
        </>
      }
    >
      <Seo title="Sign in" />
      <form
        noValidate
        className="space-y-5"
        onSubmit={handleSubmit(async (v) => {
          setError(undefined);
          try {
            const user = await api.auth.login(v.email, v.password);
            setUser(user);
            toast(`Welcome back, ${user.firstName}`);
            navigate(next, { replace: true });
          } catch (e) {
            setError((e as Error).message);
          }
        })}
      >
        <FormError message={error} />
        <TextField label="Email" type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
        <TextField label="Password" type="password" autoComplete="current-password" error={formState.errors.password?.message} {...register('password')} />
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={formState.isSubmitting}>
          Sign in
        </Button>
      </form>
      <div className="mt-6 rounded-soft bg-tint p-4 text-sm">
        <p className="font-semibold">Demo account</p>
        <p className="mt-1 text-muted">
          {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={() => {
            setValue('email', DEMO_CREDENTIALS.email);
            setValue('password', DEMO_CREDENTIALS.password);
          }}
        >
          Fill demo credentials
        </Button>
      </div>
    </AuthShell>
  );
}
