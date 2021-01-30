import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Output.css';

//S8DFP71Y546QKFCY

const Output = (props) => {
	const data = props.data;
	let totalCosts = 0;
	let totalIncomes = 0;
	let goal = 0;

	let remaining_goals = [];

	let goal_dates = [];
	let goal_targets = [];
	let goal_amounts = [];

	let end_amount = 0;

	const [stock, setStock] = useState([]);

	//stock api
	useEffect(() => {
		async function fetchData() {
			let today = new Date();
			today.setDate(today.getDate() - 1);
			today = today.toISOString().split('T')[0];
			const stock = await axios.get(
				'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IVV&outputsize=compact&apikey=S8DFP71Y546QKFCY'
			);
			let ivv = stock.data['Time Series (Daily)'][today]['1. open'];
			setStock(parseInt(ivv).toFixed(2));
		}
		fetchData();
	}, []);

	if (data !== null) {
		let start_date = data.start_date;
		let initial_contribution = data.initial_contribution;

		let costs_sum = 0;
		let incomes_sum = 0;

		const costs = Object.keys(data).filter((v) => v.startsWith('cost_'));
		if (costs.length > 0) {
			for (let i = 0; i < costs.length; i++) {
				const costs_amt = data[costs[i]];
				if (costs_amt !== '') {
					costs_sum += parseInt(costs_amt);
				}
			}
		}

		const incomes = Object.keys(data).filter((v) => v.startsWith('income_'));
		if (incomes.length > 0) {
			for (let i = 0; i < incomes.length; i++) {
				const incomes_amt = data[incomes[i]];
				if (incomes_amt !== '') {
					incomes_sum += parseInt(incomes_amt);
				}
			}
		}

		const goal_dates_keys = Object.keys(data)
			.filter((v) => v.startsWith('goal_'))
			.filter((v) => v.endsWith('_date'));
		const goal_targets_keys = Object.keys(data)
			.filter((v) => v.startsWith('goal_'))
			.filter((v) => v.endsWith('_target'));
		const goal_amounts_keys = Object.keys(data)
			.filter((v) => v.startsWith('goal_'))
			.filter((v) => v.endsWith('_amount'));

		for (let i = 0; i < goal_dates_keys.length; i++) {
			goal_dates.push(data[goal_dates_keys[i]]);
			goal_targets.push(data[goal_targets_keys[i]]);
			if (data[goal_amounts_keys[i]] === '') {
				goal_amounts.push('0');
			} else {
				goal_amounts.push(data[goal_amounts_keys[i]]);
			}
		}

		while (goal_amounts.length > 0) {
			goal = parseInt(goal_amounts.shift());

			console.log('goal: ' + goal);
			console.log('start: ' + start_date);
			console.log('end: ' + goal_dates[0]);
			console.log('contr: ' + initial_contribution);

			totalCosts = getTotal(
				start_date,
				goal_dates[0],
				data.costs_dropdown,
				costs_sum
			);
			totalIncomes = getTotal(
				start_date,
				goal_dates[0],
				data.incomes_dropdown,
				incomes_sum
			);
			start_date = goal_dates.shift();

			console.log('costs: ' + totalCosts);
			console.log('incomes: ' + totalIncomes);

			remaining_goals.unshift(
				goal - initial_contribution - (totalIncomes - totalCosts)
			);

			console.log('remainder: ' + remaining_goals[0]);

			if (remaining_goals[0] <= 0) {
				initial_contribution = Math.abs(remaining_goals[0]);
				console.log('passing: ' + initial_contribution);
				remaining_goals[0] = 0;
			} else {
				initial_contribution = 0;
			}
		}
		end_amount = data.starting_balance - data.initial_contribution;
		if (remaining_goals[0] < 0) {
			end_amount += Math.abs(remaining_goals[0]);
		}
	}

	function getTotal(startDate, endDate, period, amount) {
		const duration = getAge(startDate, endDate);

		const sum = getSum(duration, period, amount);

		return sum;
	}

	function getSum(duration, period, amount) {
		// https://gist.github.com/Erichain/6d2c2bf16fe01edfcffa
		let day, hour, minute, seconds;
		seconds = Math.floor(duration / 1000);
		minute = Math.floor(seconds / 60);
		seconds = seconds % 60;
		hour = Math.floor(minute / 60);
		minute = minute % 60;
		day = Math.floor(hour / 24);
		hour = hour % 24;
		// https://gist.github.com/Erichain/6d2c2bf16fe01edfcffa

		if (period === 'day') {
			return day * amount;
		} else if (period === 'week') {
			return (day * amount) / 7;
		} else if (period === 'month') {
			return (day * amount) / (365 / 12);
		} else if (period === 'year') {
			return (day * amount) / 365;
		}
	}

	function getAge(startDate, endDate) {
		const sDate = new Date(startDate);
		const eDate = new Date(endDate);
		const duration = eDate.getTime() - sDate.getTime();

		return duration;
	}

	function getName(name, num) {
		if (name === '') {
			return 'Target #' + num.toString();
		} else {
			return name;
		}
	}

	return (
		<div className='Output'>
			<div className='output-header'>
				<h3>Calculations</h3>
				<h5>IVV price on today's open: ${stock}</h5>
			</div>
			{data === null ? (
				<p>Press Submit!</p>
			) : (
				<div className='results'>
					{remaining_goals.map((g, index) => {
						return g === 0 ? (
							<p style={{ color: 'green' }}>
								Remaining Goal for{' '}
								{getName(
									goal_targets.slice(0).reverse()[index],
									goal_targets.length - index
								)}
								: ${g.toFixed(2)}
							</p>
						) : (
							<p style={{ color: 'red' }}>
								Remaining Goal for{' '}
								{getName(
									goal_targets.slice(0).reverse()[index],
									goal_targets.length - index
								)}
								: ${g.toFixed(2)}
							</p>
						);
					})}
					{end_amount === 0 ? (
						<p style={{ color: 'red', fontWeight: 'bold' }}>
							You will have nothing left!
						</p>
					) : (
						<p style={{ color: 'green', fontWeight: 'bold' }}>
							You will have ${end_amount.toFixed(2)} left{' '}
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default Output;
