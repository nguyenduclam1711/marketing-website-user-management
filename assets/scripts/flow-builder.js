import intlTelInput from 'intl-tel-input';
import { get_form_payload, isGerman } from "./helper.js"
import utilsScript from "./intl-tel-input-utils.min.js"
const animtionDuration = 0.3;
const paramsString = window.location.search
let searchParams = new URLSearchParams(paramsString);
const getAnswers = (question, model) => Object.values(model.layers.find(layer => layer.type === "diagram-nodes").models)
	.filter(links => Object.values(model.layers.find(layer => layer.type === "diagram-links").models)
		.filter(layer => layer.source === question.id).map(l => l.target).includes(links.id))

const canTrigger = (questions, model) => {
	const ifThereAreNotJustButtons = questions.filter(q => {
		const allAnswers = getAnswers(q, model)
		const buttons = allAnswers.filter(answer => answer.extras.freeanswer || answer.extras.dropdown)
		return buttons.length > 0
	})
	return ifThereAreNotJustButtons.length === 0
}

const itiConfig = {
	initialCountry: "de",
	utilsScript: utilsScript,
	separateDialCode: true,
	preferredCountries: ["de", "gb"]
}

fetch(`/admin/questions/overview`, {
	headers: {
		"content-type": "application/json"
	},
})
	.then(res => res.json())
	.then(async (res) => {
		const allFlows = []
		res.payload.questions.filter(q => document.querySelector(q.renderselector)).map(flow => {
			if (
				flow.renderselector
				// && !localStorage.getItem('dcianswers') 
			) {
				allFlows.push(fetch(`/admin/questions/fetch/${flow.name} `, {
					headers: {
						"content-type": "application/json"
					},
				}))
			}
		})
		const partiallyResolved = await Promise.all(allFlows)
		const fullFlows = await Promise.all(partiallyResolved.map(res => res.json()))
		fullFlows.map(res => res.payload.questions).map(flow => {
			const diagramNodes = flow.model.layers.find(layer => layer.type === "diagram-nodes").models
			let startquestion = Object.values(diagramNodes).filter(model => model.ports.find(port => port.label === "In").links.length === 0)
			const diagramLinks = flow.model.layers.find(layer => layer.type === "diagram-links").models
			if (searchParams.get(startquestion[0].extras.questionidentifier) === "false") {
				while (startquestion.length > 0 && searchParams.get(startquestion[0].extras.questionidentifier) === "false") {
					startquestion = findNextQuestions(diagramLinks, startquestion, flow)
				}
			}
			render(startquestion, flow)
			document.addEventListener('submit', (e) => {
				if (flow.name === e.target.closest('form').dataset.flow) {
					jumpToNextQuestion(e, diagramNodes, flow)
				}
			})
		})
		document.addEventListener('change', (e) => {
			fullFlows.map(res => res.payload.questions).map(flow => {
				const questionroot = document.querySelector(flow.renderselector)
				if (questionroot) {
					if (flow.name === e.target.dataset.flow && e.target.dataset.trigger === "true") {
						const diagramNodes = flow.model.layers.find(layer => layer.type === "diagram-nodes").models
						e.target.elements = [e.target, [...e.target.closest('form').elements].find(i => i.type === "submit")]
						jumpToNextQuestion(e, diagramNodes, flow)
					}
				}
			})
		})
	})

let showedAgeWarning = false
const jumpToNextQuestion = (e, diagramNodes, flow) => {
	e.preventDefault()
	const form_payload = get_form_payload(e.target.elements)
	localStorage.setItem(`dcianswers_${flow.name}`, JSON.stringify({ ...JSON.parse(localStorage.getItem(`dcianswers_${flow.name}`)), ...form_payload }))
	const nextQuestions = Object.values(diagramNodes).filter(n => {
		return [...e.target.elements].find(i => i.type === "submit").dataset.nextquestions.includes(n.id.split(','))
	})
	if (nextQuestions.length > 0) {
		const ageBox = document.querySelector('input[name*="age"]')
		if (!showedAgeWarning && ageBox) {
			if (Number(ageBox.value) < 18) {
				const ageHint = document.createElement("div")
				ageHint.classList.add('alert')
				ageHint.classList.add('alert-danger')
				ageHint.innerHTML = "You need to be at least 18 years old to join our courses"
				ageBox.parentNode.insertBefore(ageHint, ageBox.nextSibling);
				showedAgeWarning = true
			}
		} else {
			document.querySelector(".dynamicinputform").classList.add('fade-out')
			setTimeout(() => {
				render(nextQuestions, flow)
			}, animtionDuration * 1000);
			setTimeout(() => {
				e.target.closest('form').classList.add('fully-transparent')
			}, animtionDuration * 1000 - 100);
		}
	} else {
		const submitButton = document.querySelector("button[data-nextquestions='']")
		const buttonOriginalText = submitButton.innerText
		submitButton.innerText = "Loading..."
		submitButton.disabled = true
		let payload = JSON.parse(localStorage.getItem(`dcianswers_${flow.name}`))
		var entries = Array.from(searchParams.entries()).map(i => [i[0].replace('push_', ""), i[1]])
		let hiddenQuestionWhichShouldStillBeenProcessed = entries.filter((item, index) => entries.map(i => i[0]).indexOf(item[0]) !== index)
		if (hiddenQuestionWhichShouldStillBeenProcessed.length > 0) {
			hiddenQuestionWhichShouldStillBeenProcessed.forEach(q => {
				payload[q[0]] = q[1]
			})
		}
		fetch(`/contact`, {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(payload)
		}).then(res => res.json())
			.then(data => {
				if (data.response.contact_id) {
					submitButton.innerText = "Thanks"
					localStorage.removeItem(`dcianswers_${flow.name}`)
					if (flow.sendaltemail === true) {
						const div = document.createElement('div')
						submitButton.innerText = buttonOriginalText
						submitButton.disabled = false
						div.innerHTML = `<div class="flash m-0 mx-3 alert fade show alert-success">Thank you for being interested in getting to know DCI! Our Career Success Management will get in touch with you to further discover how we can support you!<button class="close ml-3" type="button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>`
						document.body.appendChild(div)
						$("#contactFormModal").modal('hide')
					} else if (data.response.curriculumPdf) {
						$("#curriculumpopup").modal('hide')
						window.open(`${window.location.origin}/images/${data.response.curriculumPdf}`, '_blank')
					} else {
						window.location.replace(`${window.location.origin}/thank-you/${data.response.contact_id}`);
					}
				} else if (data.response.error) {
					const div = document.createElement('div')
					submitButton.innerText = buttonOriginalText
					submitButton.disabled = false
					div.innerHTML = `<div class="flash m-0 mx-3 alert fade show alert-danger ">${data.response.error}<button class="close ml-3" type="button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>`
					document.body.appendChild(div)
				}
			}).catch(e => {
				console.log('e', e);
			})
	}
}

const input = document.querySelector('input[name*="phone"]')
if (input) {
	const iti = intlTelInput(input, itiConfig);
}
const findNextQuestions = (diagramLinks, questions, flow) => {
	var linksToNextQ = questions.map(q => {
		return Object.values(flow.model.layers.find(layer => layer.type === "diagram-nodes").models)
			.filter(links => Object.values(diagramLinks)
				.filter(layer => layer.source === q.id).map(l => l.target).includes(links.id))
	}).flat().map(a => a.ports[1].links).flat()

	var nextQuestions = Object.values(flow.model.layers.find(layer => layer.type === "diagram-nodes").models)
		.filter(node => {
			return node.ports[0].links.find(l => {
				if (linksToNextQ.includes(l)) {
					return node
				}
			})
		});
	return nextQuestions
}
const render = (questions, flow) => {
	const questionroot = document.querySelector(flow.renderselector)
	if (questionroot) {
		const diagramLinks = flow.model.layers.find(layer => layer.type === "diagram-links").models
		if (diagramLinks) {
			let nextQuestions = findNextQuestions(diagramLinks, questions, flow)
			let i = 0
			if (nextQuestions.length > 0) {
				while (nextQuestions.length > 0 && searchParams.get(nextQuestions[0].extras.questionidentifier) === "false") {
					if (searchParams.get(nextQuestions[0].extras.questionidentifier) === "false") {
						nextQuestions = findNextQuestions(diagramLinks, nextQuestions, flow)
					}
					i++
				}
			}
			const html = `
		<div class="w-100 container">
		<div id="popup" class="py-5 d-flex flex-column justify-content-between w-300px w-100">
      <form data-flow="${flow.name}" onSubmit="return false;" class="dynamicinputform d-flex flex-column justify-content-center" style="animation-duration: ${animtionDuration}s">
        ${questions.map((question, index) => {
			const answers = getAnswers(question, flow.model);
			const buttons = answers.filter(answer => !answer.extras.freeanswer && !answer.extras.dropdown);
			const freeanswers = answers.filter(answer => answer.extras.freeanswer && !answer.extras.dropdown);
			const dropdowns = answers.filter(answer => answer.extras.dropdown);
			const attributes = (answer) => `
				placeholder="${isGerman ? (answer.extras.answertranslation.indexOf(':') !== -1 ? answer.extras.answertranslation.split(':')[1] : "") : (answer.name.indexOf(':') !== -1 ? answer.name.split(':')[1] : "")}"
				class="form-control mb-4 freeanswer dynamicinput" 
				name="${answer.extras.answeridentifier}"
				data-type="question"
				${answer.extras.freeanswer_type === 'hidden' && searchParams.has(answer.extras.answeridentifier) ? `value="${searchParams.get(answer.extras.answeridentifier)}"` : answer.extras.freeanswer_type === 'hidden' ? `value="${answer.name}"` : ``}
				${answer.extras.freeanswer_type === 'tel' ? `pattern="^\\+?\\d+$"` : ``}
				type="${answer.extras.freeanswer_type ? answer.extras.freeanswer_type : "text"}" 
				id="freeanswer_${answer.extras.answeridentifier}"
				required`

			const notTextAreas = freeanswers.filter(f => f.extras.freeanswer_type !== 'textarea' && f.extras.freeanswer_type !== 'hidden')
			const textAreas = freeanswers.filter(f => f.extras.freeanswer_type === 'textarea' && f.extras.freeanswer_type !== 'hidden')
			const hiddens = freeanswers.filter(f => f.extras.freeanswer_type === 'hidden')
			return `
				<div class="d-flex justify-content-center mb-5 px-3">
				<p class="text-center">${isGerman && question.extras.questiontranslation ? question.extras.questiontranslation : question.name}</p>
				</div>
				<div class="">
				<div class="w-100">
				${freeanswers.length > 0 ? "<div class='row'>" + [...notTextAreas, ...textAreas].map((answer, index) => {
					return `<div class="
					${((index === notTextAreas.length - 1) && (index % 2 == 0)) || answer.extras.freeanswer_type === 'textarea' || answer.extras.freeanswer_type === 'email' || answer.extras.freeanswer_type === 'tel' ? 'col-12' : 'col-6'}">
					${answer.extras.freeanswer_type !== 'hidden' ? `<label for="freeanswer_${answer.extras.answeridentifier}">
					${isGerman ? (answer.extras.answertranslation.indexOf(':') !== -1 ? answer.extras.answertranslation.split(':')[0] : answer.extras.answertranslation) : (answer.name.indexOf(':') !== -1 ? answer.name.split(':')[0] : answer.name)}</label>` : ``}
				  ${answer.extras.freeanswer_type === 'textarea' ? `
					<textarea ${attributes(answer)} ></textarea>
						` : `
						<input ${attributes(answer)} />
							`}

				</div>`
				}).join('') + `${hiddens.map((answer, index) => {
					return `<input ${attributes(answer)} />`
				}).join('')}` + "</div><span id='error-msg' class='text-danger d-block'></span>" : ""}
              ${dropdowns.length > 0 ? dropdowns.map(answer => (`
			  <label for="dropdown_${answer.extras.answeridentifier}">${isGerman && answer.extras.answertranslation ? answer.extras.answertranslation.split(":")[0] : answer.name.split(":")[0]}</label>
			  <select 
			  id="dropdown_${answer.extras.answeridentifier}" 
			  name="${answer.extras.answeridentifier}" 
			  class="form-select mb-5 dynamicinput dropdown"
			  required="required">
			  <option 
			  class="form-control mb-4" name="button" type="text" data-type="question" placeholder="${isGerman ? "Auswählen..." : "Select..."}" type="text" value="" disabled selected>${isGerman ? "Auswählen..." : "Select..."}</option>` +
				  (isGerman && answer.extras.answertranslation ? answer.extras.answertranslation : answer.name).split(":").reverse()[0].split(',').map(dropdownItem => `
								<option class="form-control mb-4" 
								name="button" 
								type="text" 
								data-type="question" 
								value="${dropdownItem.replace(/\(.*\)/, '').trim()}" 
								placeholder="${answer.extras.answeridentifier}" 
								type="text">${dropdownItem.replace(/.*\((.*)\)/, '$1')}`).join('')
				  + `</select>`)).join("") : ""}
              ${buttons.map(answer => {
				  return `<div class="form-group">
                <input 
				type="radio" 
				value="${answer.extras.answeridentifier}"
				id="${answer.extras.answeridentifier}"
				data-flow="${flow.name}"
				name="${question.extras.questionidentifier}" 
				class="btn-check dynamicinput"
				data-trigger="${canTrigger(questions, flow.model) && nextQuestions.length !== 0}"
				data-question="${question.extras.questionidentifier}" 
				data-nextquestions="${nextQuestions.map(a => a.id)}" 
				required
				/>
                <label class=" btn btn-lg py-4 mb-5 btn-white blue-light-shadow answerbutton w-100 mb-3 px-5" for="${answer.extras.answeridentifier}">${isGerman && answer.extras.answertranslation ? answer.extras.answertranslation : answer.name}</label>
                </div>`
			  }).join('')}
              ${canTrigger(questions, flow.model) ? `<button class="d-none fakebutton btn btn-lg w-100 btn-outline-secondary mb-4  mr-2 answerbutton" data-nextquestions="${nextQuestions.map(a => a.id)}" type="submit">${isGerman ? `Weiter` : `Next`}</button>` : ``}
                  </div>
                </div>` }).join('')}
                ${nextQuestions.length === 0 ? `
				<div class="px-3 mt-5">
              <div class="">
				<input type="text" name="age_field" class="agefield"/>
				${flow.sendaltemail ? `<input type="hidden" name="sendaltemail" value="true" class="sendaltemail"/>` : ``}
				<p><label class="checkbox TermsofService text-muted">${isGerman ? `Gelesen und akzeptiert` : `I have read and agree to the`}<input type="checkbox" name="TermsofService" value="true" required="required" class="dynamicinput"><span class="checkmark"></span></label><a href="#" class="ml-1 font-weight-normal text-dark text-decoration-none" data-toggle="modal" data-target="#dataPrivacy">${isGerman ? `Datenschutz` : `Data privacy`}</a></p>` : ``}
                ${canTrigger(questions, flow.model) && nextQuestions.length !== 0 ? `` : `<div class="d-flex justify-content-end"><button class="btn btn-lg mb-4 answerbutton ${nextQuestions.length === 0 ? "w-md-50 w-100 btn-secondary" : "btn-outline-secondary w-100"}" data-nextquestions="${nextQuestions.map(a => a.id)}" type="submit">${nextQuestions.length === 0 ? (isGerman ? `Abschicken` : `Submit`) : (isGerman ? `Weiter` : `Next`)}`}</button></div>
                ${nextQuestions.length === 0 ? `<p class='text-muted small asterix'>${isGerman ? `Durch Deine Registrierung stimmst Du zu, dass personenbezogene Daten gespeichert werden. Diese dürfen von der Digital Career Institute gGmbH genutzt werden, um mit Dir in Kontakt zu treten, sofern Du dies nicht ausdrücklich untersagst.` : `With this registration you agree with the storage of your data. These data will be used by Digital Career Institute gGmbH to contact you. You have the right to access, modify, rectify and delete these data.`}</p>
				</div>
            </div>
			` : ``}
        </form>
      </div>
    </div>`;

			const questionRootRenderElement = document.getElementById(`questionroot_render_element_${flow.name}`)
			if (!questionRootRenderElement) {
				const renderElement = document.createElement(`div`)
				renderElement.id = `questionroot_render_element_${flow.name}`
				renderElement.classList.add('w-100')
				renderElement.innerHTML = html
				setTimeout(() => {
					document.querySelector('.dynamicinputform').classList.remove('fully-transparent')
				}, 100);
				questionroot.appendChild(renderElement)
			} else {
				questionRootRenderElement.innerHTML = html
			}
			const phoneFields = document.querySelectorAll('input[name*="phone"]')
			Array.from(phoneFields).map(input => {
				if (input) {
					const iti = intlTelInput(input, itiConfig);
					input.addEventListener('change', (e) => {
						e.target.value = e.target.value.replace(/[^\d]/g, "")
					})
					input.addEventListener('blur', (e) => {
						var errorCode = iti.getValidationError();
						if (errorCode !== 0) {
							var errorMap = []
							errorMap[-99] = "Please enter a valid phone number."
							errorMap[1] = "Please enter a valid phone number."
							errorMap[2] = "Please enter a valid phone number."
							errorMap[3] = "Please enter a valid phone number."
							errorMap[4] = "Please enter a valid phone number."
							errorMap[5] = "Please enter a valid phone number.";
							document.querySelector('#error-msg').innerHTML = errorMap[errorCode];
						} else {
							document.querySelector('#error-msg').innerHTML = "";
						}
					})
				}
			})
			const emailFields = document.querySelectorAll('input[type="email"]')
			Array.from(emailFields).map(emailField => {
				if (window._nb !== undefined && emailField) {
					_nb.fields.registerListener(emailField, true);
				}
			})
		}
	}
}