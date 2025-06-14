import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { postRequest } from "../../services/apiServices";
import { useState, useEffect } from "react";


const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await postRequest(
        `/stripe/create-payment-intent`,
        { amount: 1000, currency: "usd" },
        undefined,
        token
      ) as { data: { clientSecret: string } };

      console.log('response', response)
      setClientSecret(response?.data?.clientSecret);
    };

    fetchClientSecret();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      console.error(error);
    } else {
      console.log("Payment successful!", paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="border p-3 rounded-md w-screen" />
      <button type="submit" className="bg-teal-500 py-3 px-6 text-white rounded-md" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};

export default PaymentForm
