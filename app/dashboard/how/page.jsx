"use client";
import React from 'react';

function How() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold mb-6 text-center">How it Works?</h2>
      
      <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
        <p>
          Our platform simulates a real-life interview experience powered by AI. 
          Just follow these simple steps to begin your mock interview journey:
        </p>

        <ol className="list-decimal list-inside space-y-3">
          <li>
            <strong>Create a Mock Interview:</strong> Provide your desired job position, job description, and years of experience.
          </li>
          <li>
            <strong>AI-Generated Questions:</strong> Based on your input, our AI generates 5 tailored interview questions.
          </li>
          <li>
            <strong>Listen to Questions:</strong> Each question is also available in audio format, so you can simulate a real-time interview experience.
          </li>
          <li>
            <strong>Record Your Answers:</strong> Respond to each question by recording your voice with a single click.
          </li>
          <li>
            <strong>Get Instant Feedback:</strong> Once submitted, our AI provides a rating, identifies improvement areas, and also shows the correct answer.
          </li>
        </ol>

        <p>
          You can review all your mock interviews and feedback anytime from your dashboard. Plus, enjoy premium features with our subscription plans:
        </p>

        <ul className="list-disc list-inside ml-4 space-y-1">
          <li><strong>Monthly Plan:</strong> $7.99/month</li>
          <li><strong>Yearly Plan:</strong> $49/year</li>
        </ul>

        <p className="mt-4">
          Whether you're preparing for your first job or your next big move, our AI-powered mock interviews help you improve with confidence.
        </p>
      </div>
    </div>
  );
}

export default How;
