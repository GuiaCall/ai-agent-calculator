
import Stripe from 'https://esm.sh/stripe@14.21.0';

// Initialize Stripe with the API key
export const initializeStripe = () => {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeSecretKey) {
    throw new Error("Stripe secret key not found in environment");
  }

  console.log("Initializing Stripe");
  return new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });
};

// Check if customer exists or create a new one
export const getOrCreateCustomer = async (stripe: Stripe, email: string, userId: string) => {
  console.log("Checking for existing customer with email:", email);
  const customers = await stripe.customers.list({
    email: email,
    limit: 1
  });

  if (customers.data.length > 0) {
    console.log("Found existing customer:", customers.data[0].id);
    const customer_id = customers.data[0].id;
    
    // Check if customer already has an active subscription - removed test mode check
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customers.data[0].id,
        status: 'active',
        limit: 1
      });

      if (subscriptions.data.length > 0) {
        console.log("Customer already has an active subscription");
        throw new Error("You already have an active subscription");
      }
    } catch (subErr) {
      // Only re-throw if it's our custom error
      if (subErr.message === "You already have an active subscription") {
        throw subErr;
      }
      console.error("Error checking subscriptions:", subErr);
      // Continue even if subscription check fails
    }
    
    return customer_id;
  } else {
    // Create a new customer if one doesn't exist
    console.log("Creating new customer");
    try {
      const newCustomer = await stripe.customers.create({
        email: email,
        metadata: {
          user_id: userId
        }
      });
      console.log("Created new customer:", newCustomer.id);
      return newCustomer.id;
    } catch (err) {
      console.error("Failed to create customer:", err);
      throw new Error("Failed to create customer in Stripe");
    }
  }
};

// Create a checkout session with Stripe
export const createCheckoutSession = async (
  stripe: Stripe, 
  customerId: string, 
  userId: string, 
  origin: string, 
  couponCode?: string
) => {
  const sessionParams: any = {
    customer: customerId,
    line_items: [
      {
        price: 'price_1QZBgMJxQ3vRyrS2UvIcF8Oe', // Make sure this price ID exists in your Stripe account
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${origin}/dashboard?checkout_success=true`,
    cancel_url: `${origin}/pricing`,
    allow_promotion_codes: true,
    metadata: {
      user_id: userId
    }
  };

  // Add coupon code if provided
  if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
    console.log("Checking coupon code:", couponCode);
    try {
      // Validate if coupon exists and is valid
      const coupon = await stripe.coupons.retrieve(couponCode.trim());
      if (coupon.valid) {
        console.log("Valid coupon code:", couponCode);
        sessionParams.discounts = [{ coupon: couponCode.trim() }];
      }
    } catch (couponError) {
      console.log('Invalid coupon code:', couponError);
      // We'll proceed without the coupon if it's invalid
    }
  }

  try {
    console.log("Creating checkout session with params:", JSON.stringify(sessionParams));
    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("Checkout session created:", session.id);
    console.log("Session URL:", session.url);
    
    if (!session.url) {
      throw new Error("Checkout session URL is missing");
    }
    
    return session.url;
  } catch (stripeError) {
    console.error("Stripe session creation error:", stripeError);
    throw new Error(stripeError.message || "Failed to create checkout session");
  }
};
