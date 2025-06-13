import React, { useState } from "react";

interface LazyImageProps {
	src: string;
	alt: string;
	className: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
	// State to track if the image has loaded
	const [isLoaded, setIsLoaded] = useState(false);

	// Function to handle image loading
	const handleImageLoad = () => {
		setIsLoaded(true); // Set isLoaded to true once the image is loaded
	};

	return (
		<div className={`${className} relative`}>
			{/* Actual image */}
			<img
				src={src}
				alt={alt}
				className={`w-full h-full object-contain  transition-all duration-500 ${
					isLoaded ? "opacity-100" : "opacity-70 blur-sm"
				}`}
				onLoad={handleImageLoad} // Trigger the handleImageLoad when the image is loaded
				loading="lazy" // Enable lazy loading to improve performance
			/>
		</div>
	);
};

export default LazyImage;
