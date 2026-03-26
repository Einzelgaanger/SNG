/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

const LOGO_URL = 'https://dtihbwqrjsvigtautuxr.supabase.co/storage/v1/object/public/email-assets/vgg-logo.webp'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to {siteName} — confirm your email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src={LOGO_URL} alt="Venture Garden Group" width="180" height="auto" style={logo} />
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Welcome to {siteName}</Heading>
        <Text style={text}>
          Thanks for joining{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          ! We're excited to have you on board. Let's get started by verifying your email address.
        </Text>
        <Text style={text}>
          Confirm your address (
          <Link href={`mailto:${recipient}`} style={link}>{recipient}</Link>
          ) by clicking below:
        </Text>
        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            Get Started
          </Button>
        </Section>
        <Hr style={divider} />
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
        <Text style={footerBrand}>
          © {new Date().getFullYear()} Venture Garden Group. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#f7f8fa', fontFamily: "'DM Sans', 'Segoe UI', Arial, sans-serif" }
const container = { backgroundColor: '#ffffff', padding: '0', maxWidth: '520px' as const, margin: '40px auto', borderRadius: '12px', border: '1px solid #e8eaed' }
const logoSection = { padding: '32px 40px 20px' }
const logo = { display: 'block' as const }
const divider = { borderColor: '#e8eaed', margin: '0 40px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#1a2332', margin: '28px 40px 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#4a5568', lineHeight: '1.7', margin: '0 40px 20px' }
const link = { color: '#2E86C1', textDecoration: 'underline' }
const buttonSection = { padding: '8px 40px 28px', textAlign: 'center' as const }
const button = { backgroundColor: '#4DB848', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '8px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' as const }
const footer = { fontSize: '13px', color: '#8b93a1', margin: '20px 40px 8px', lineHeight: '1.5' }
const footerBrand = { fontSize: '12px', color: '#b0b7c3', margin: '0 40px 32px' }
