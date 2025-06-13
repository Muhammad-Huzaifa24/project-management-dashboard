import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
// import PaymentForm from "./Components/paymentForm";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";


// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


function App() {
	return (
		<>
			{/* <Elements stripe={stripePromise}>
				<div className="w-screen h-screen flex items-center justify-center">
					<PaymentForm />
				</div>
			</Elements> */}
			<Toaster />
			<AppRoutes />
		</>
	);
}

export default App;
