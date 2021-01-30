import React, { useState, useReducer } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import './Input.css';

const Input = (props) => {
	const [_, forceUpdate] = useReducer((x) => x + 1, 0); // eslint-disable-line

	const { register, control, handleSubmit } = useForm();
	const { fields, append } = useFieldArray({ control, name: 'addedInput' });

	const [newField, setNewField] = useState([]);
	const [numGoals, setNumGoals] = useState(['']);
	const [costToggle, setCostToggle] = useState(true);
	const [incomeToggle, setIncomeToggle] = useState(true);

	const doSetNumGoals = () => {
		const prevNum = numGoals;
		prevNum.push('');
		setNumGoals(prevNum);
		forceUpdate();
	};

	const doSetNewField = (text, inputType) => {
		if (inputType === 'cost_') {
			if (text === '') {
				console.log('shouldtoggle');
				setCostToggle(true);
			} else {
				setCostToggle(false);
			}
		}
		if (inputType === 'income_') {
			if (text === '') {
				console.log('shouldtoggle');
				setIncomeToggle(true);
			} else {
				setIncomeToggle(false);
			}
		}

		const newArray = newField;
		newArray.push(inputType + text);
		setNewField(newArray);
		console.log(text);
	};

	const onSubmit = (data) => {
		props.updateData(data);
	};

	// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
	const today_date = new Date().toISOString().split('T')[0];

	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	function fieldsContains(str) {
		if (fields.length > 0) {
			for (let i = 0; i < fields.length; i++) {
				if (fields[i].value === str) {
					return true;
				}
			}
		}
		return false;
	}

	return (
		<div className='Input'>
			<div className='input-header'>
				<h3>Enter Input</h3>
			</div>
			<div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='inputForm-content-container'>
						<div className='generalInput'>
							<div className='generalInput-header'>
								<h4>General Parameters</h4>
							</div>
							<div className='generalInput-field-container'>
								<ul>
									<li>
										<label htmlFor='start_date'>Start Date:</label>
										<p></p>
										<input
											type='date'
											name='start_date'
											defaultValue={today_date}
											min={today_date}
											max='2028-12-31'
											ref={register}
										/>
									</li>
									<li>
										<label htmlFor='start_balance'>Starting Balance:</label>
										<p></p>
										<input
											type='text'
											placeholder='$0'
											name='starting_balance'
											ref={register}
										/>
									</li>
									<li>
										<label htmlFor='initial_contribution'>
											Initial Contribution:
										</label>
										<p></p>
										<input
											type='text'
											placeholder='$0'
											name='initial_contribution'
											ref={register}
										/>
									</li>
								</ul>
							</div>
						</div>
						<div className='costs_incomes'>
							<div className='essentialCosts'>
								<div className='essentialCosts-header'>
									<h4>Essential Costs</h4>
									<div className='costsDropdown'>
										<label htmlFor='costs_dropdown'>Period</label>
										<span></span>
										<select name='costs_dropdown' ref={register}>
											<option value='day'>d</option>
											<option value='week'>w</option>
											<option value='month'>m</option>
											<option value='year'>y</option>
										</select>
									</div>
									<div className='costs_add'>
										<input
											type='text'
											placeholder='New Cost'
											id='addCostField'
											onChange={(e) => doSetNewField(e.target.value, 'cost_')}
										/>

										<button
											type='button'
											disabled={costToggle}
											onClick={() =>
												!fieldsContains(newField[newField.length - 1]) &&
												append({
													name: 'addedInput',
													value: newField[newField.length - 1],
												})
											}
										>
											{' '}
											Add
										</button>
									</div>
								</div>

								<div className='essentialCosts-field-container'>
									<ul>
										<li>
											<label htmlFor='cost_food'>Food:</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='cost_food'
												ref={register}
											/>
										</li>
										<li>
											<label htmlFor='cost_wifi'>WiFi:</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='cost_wifi'
												ref={register}
											/>
										</li>
										<li>
											<label htmlFor='cost_laundry'>Laundry:</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='cost_laundry'
												ref={register}
											/>
										</li>
										<li>
											<label htmlFor='cost_cleaningSupplies'>
												Cleaning Supplies:
											</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='cost_cleaningSupplies'
												ref={register}
											/>
										</li>
										<li>
											<label htmlFor='cost_other'>Other:</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='cost_other'
												ref={register}
											/>
										</li>
										{fields.map((item, index) =>
											item.value.split('_')[0] === 'cost' ? (
												<li key={item.id}>
													{/* for empty validation register make sure pass empty object  */}
													<label htmlFor={`${item.value}`}>{`${toTitleCase(
														item.value.split('_').pop()
													)}:`}</label>
													<p></p>
													<input
														name={`${item.value}`}
														placeholder='$0'
														ref={register({})}
													/>
												</li>
											) : (
												<span></span>
											)
										)}
									</ul>
								</div>
							</div>

							<div className='incomeSources'>
								<div className='incomeSources-header'>
									<h4>Income Sources</h4>
									<div className='incomeDropdown'>
										<label htmlFor='incomes_dropdown'>Period</label>
										<span></span>
										<select name='incomes_dropdown' ref={register}>
											<option value='day'>d</option>
											<option value='week'>w</option>
											<option value='month'>m</option>
											<option value='year'>y</option>
										</select>
									</div>
									<div className='income_add'>
										<input
											type='text'
											placeholder='New Income'
											id='addIncomeField'
											onChange={(e) => doSetNewField(e.target.value, 'income_')}
										/>

										<button
											type='button'
											disabled={incomeToggle}
											onClick={() =>
												!fieldsContains(newField[newField.length - 1]) &&
												append({
													name: 'addedInput',
													value: newField[newField.length - 1],
												})
											}
										>
											{' '}
											Add
										</button>
									</div>
								</div>

								<div className='incomeSources-field-container'>
									<ul>
										<li>
											<label htmlFor='income_salary'>Salary:</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='income_salary'
												ref={register}
											/>
										</li>
										<li>
											<label htmlFor='income_bonus'>Bonus:</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='income_bonus'
												ref={register}
											/>
										</li>
										<li>
											<label htmlFor='income_gifts'>Gifts:</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='income_gifts'
												ref={register}
											/>
										</li>
										<li>
											<label htmlFor='income_investments'>Investments:</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='income_investments'
												ref={register}
											/>
										</li>
										<li>
											<label htmlFor='income_other'>Other:</label>
											<p></p>
											<input
												type='text'
												placeholder='$0'
												name='income_other'
												ref={register}
											/>
										</li>
										{fields.map((item, index) =>
											item.value.split('_')[0] === 'income' ? (
												<li key={item.id}>
													{/* for empty validation register make sure pass empty object  */}
													<label htmlFor={`${item.value}`}>{`${toTitleCase(
														item.value.split('_').pop()
													)}:`}</label>
													<p></p>
													<input
														name={`${item.value}`}
														placeholder='$0'
														ref={register({})}
													/>
												</li>
											) : (
												<span></span>
											)
										)}
									</ul>
								</div>
							</div>
						</div>

						<div className='goals-container'>
							<div className='goals-header'>
								<h4>Saving Goals</h4>
								<div className='addGoal-button'>
									<button type='button' onClick={() => doSetNumGoals()}>
										Add Goal
									</button>
								</div>
								<div className='goals-list-container'>
									{numGoals.map((goal, index) => (
										<div>
											<ul>
												<li>
													<label htmlFor={`goal_${index}_target`}>{`Target ${
														index + 1
													}:`}</label>
													<p></p>
													<input
														type='text'
														placeholder='saving for...'
														name={`goal_${index}_target`}
														ref={register}
													/>
												</li>
												<li>
													<label htmlFor={`goal_${index}_amount`}>
														Amount:
													</label>
													<p></p>
													<input
														type='text'
														placeholder='$0'
														name={`goal_${index}_amount`}
														ref={register}
													/>
												</li>
												<li>
													<label htmlFor={`goal_${index}_date`}>Save By:</label>
													<p></p>
													<input
														type='date'
														name={`goal_${index}_date`}
														defaultValue={today_date}
														min={today_date}
														max='2028-12-31'
														ref={register}
													/>
												</li>
											</ul>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<input type='submit' value='Submit' id='inputSubmit' />
				</form>
			</div>
		</div>
	);
};

export default Input;
