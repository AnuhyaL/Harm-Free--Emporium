import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { api } from '@/api';
import { Button, Checkbox, FormError, Seo, TextField } from '@/components/ui';
import { REWARDS } from '@/data';
import { useAuth, useUI } from '@/store';
import { AuthShell } from './AuthShell';
import { safeNext } from './Login';

const schema = z
  .object({
    firstName: z.string().trim().min(1, 'Enter your first name.'),
    lastName: z.string().trim().min(1, 'Enter your last name.'),
    email: z.string().trim().email('Enter a valid email address.'),
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirm: z.string(),
    referralCode: z.string().trim().optional(),
    marketingOptIn: z.boolean(),
    terms: z.literal(true, { errorMap: () => ({ message: 'Please accept the terms to continue.' }) }),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match.' });
type Values = z.infer<typeof schema>;

export default function Signup() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);
  const toast = useUI((s) => s.toast);
  const [error, setError] = useState<string>();
  const { register, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { referralCode: params.get('ref') ?? '', marketingOptIn: true },
  });
  const e = formState.errors;

  return (
    <AuthShell title="Create your account" intro={<>Already have one? <Link to="/login">Sign in</Link></>}>
      <Seo title="Create account" />
      <form
        noValidate
        className="grid gap-5 sm:grid-cols-2"
        onSubmit={handleSubmit(async (v) => {
          setError(undefined);
          try {
            const r = await api.auth.signup(v);
            setUser(r.user);
            toast(`Welcome, ${r.user.firstName}! ${REWARDS.signupPoints} points added.${r.referralApplied ? ' Your friend earned points too.' : ''}`);
            navigate(safeNext(params.get('next')), { replace: true });
          } catch (err) {
            setError((err as Error).message);
          }
        })}
      >
        <div className="sm:col-span-2">
          <FormError message={error} />
        </div>
        <TextField label="First name" autoComplete="given-name" error={e.firstName?.message} {...register('firstName')} />
        <TextField label="Last name" autoComplete="family-name" error={e.lastName?.message} {...register('lastName')} />
        <TextField className="sm:col-span-2" label="Email" type="email" autoComplete="email" error={e.email?.message} {...register('email')} />
        <TextField label="Password" type="password" autoComplete="new-password" hint="At least 8 characters." error={e.password?.message} {...register('password')} />
        <TextField label="Confirm password" type="password" autoComplete="new-password" error={e.confirm?.message} {...register('confirm')} />
        <TextField className="sm:col-span-2" label="Referral code" optional hint={`Have a friend’s code? You both get rewarded.`} {...register('referralCode')} />
        <Checkbox className="sm:col-span-2" label="Send me new HarmFree finds and refill reminders (monthly)" {...register('marketingOptIn')} />
        <Checkbox
          className="sm:col-span-2"
          label={
            <>
              I agree to the <Link to="/policies/terms">Terms</Link> and <Link to="/policies/privacy">Privacy Policy</Link>.
            </>
          }
          error={e.terms?.message}
          {...register('terms')}
        />
        <Button type="submit" size="lg" className="sm:col-span-2" loading={formState.isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
