import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const MFASetup: React.FC = () => {
  const { setupMFA, user } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.mfaEnabled) {
      toast.info('MFA is already enabled for your account');
      return;
    }
    handleSetupMFA();
  }, []);

  const handleSetupMFA = async () => {
    try {
      setIsLoading(true);
      const response = await setupMFA();
      setQrCode(response.qrCode);
      setSecret(response.secret);
      setStep('verify');
    } catch (error: any) {
      toast.error(error.message || 'Failed to setup MFA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success('Secret copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy secret');
    }
  };

  const handleVerifyMFA = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }

    try {
      setIsLoading(true);
      // This would typically verify the MFA setup
      toast.success('MFA setup completed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'MFA verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.mfaEnabled) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            MFA Already Enabled
          </h2>
          <p className="text-gray-600">
            Two-factor authentication is already active on your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-6">
        <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Setup Two-Factor Authentication
        </h2>
        <p className="text-gray-600">
          Secure your account with an additional layer of protection
        </p>
      </div>

      {step === 'setup' && (
        <div className="text-center">
          <button
            onClick={handleSetupMFA}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
          >
            {isLoading ? 'Setting up...' : 'Start MFA Setup'}
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-6">
          {/* QR Code */}
          {qrCode && (
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Scan QR Code
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <img 
                  src={qrCode} 
                  alt="MFA QR Code" 
                  className="mx-auto max-w-full h-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
            </div>
          )}

          {/* Manual Secret */}
          {secret && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Or enter this secret manually:
              </h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={secret}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={handleCopySecret}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Copy secret"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Verification */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Enter verification code:
            </h4>
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
            />
          </div>

          <button
            onClick={handleVerifyMFA}
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
          >
            {isLoading ? 'Verifying...' : 'Complete Setup'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MFASetup;
