import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taxId } = await req.json();
    console.log('Verifying Tax ID:', taxId);

    // Validate format: either TIN (10+ digits) or Taxpayer ID (N-XXXXXXXX format)
    const tinPattern = /^\d{10,}$/;
    const taxPayerIdPattern = /^N-\d{8,}$/i;
    
    if (!tinPattern.test(taxId) && !taxPayerIdPattern.test(taxId.toUpperCase())) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid format. Use either TIN (10 digits) or Taxpayer ID (N-XXXXXXXX)' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // TODO: Connect to actual LIRS API when credentials are provided
    // For now, simulate API call with validation
    // const LIRS_API_KEY = Deno.env.get('LIRS_API_KEY');
    // const response = await fetch('https://etax.lirs.net/api/verify', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${LIRS_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ taxId })
    // });
    
    // Simulate LIRS API response with validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock verified taxpayer data based on Tax ID
    const mockVerifiedData = {
      success: true,
      taxId: taxId.toUpperCase(),
      taxpayerName: `TAXPAYER ${taxId.slice(-4)}`, // In production, this comes from LIRS API
      verified: true,
      registrationDate: new Date().toISOString(),
      status: 'active'
    };

    console.log('Verification result:', mockVerifiedData);

    return new Response(
      JSON.stringify(mockVerifiedData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in verify-tax-id function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Verification failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
