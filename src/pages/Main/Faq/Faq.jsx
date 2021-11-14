import React from 'react';
import { questions } from './questions.jsx';
import './Faq.css';
export default function Faq() {
	return (
		<div className='faq'>
			<h1>FAQ - Preguntas Frecuentes</h1>
			{questions.map((question) => {
				return <div className='question'>{question}</div>;
			})}
		</div>
	);
}
