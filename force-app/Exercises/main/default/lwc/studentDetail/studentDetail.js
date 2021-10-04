import { LightningElement, wire } from 'lwc';

import { reduceErrors } from 'c/ldsUtils';

import { getRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import SELECTED_STUDENT_CHANNEL from '@salesforce/messageChannel/SelectedStudentChannel__c';


import FIELD_Name from '@salesforce/schema/Contact.Name';
import FIELD_Description from '@salesforce/schema/Contact.Description';
import FIELD_Email from '@salesforce/schema/Contact.Email';
import FIELD_Phone from '@salesforce/schema/Contact.Phone';
const fields = [FIELD_Name, FIELD_Description, FIELD_Email, FIELD_Phone];

export default class StudentDetail extends LightningElement {

	studentId;
	subscription;

	@wire(MessageContext) messageContext;
	
	@wire(getRecord, { recordId: '$studentId', fields })
	wiredStudent;
	
	connectedCallback() {
		if(this.subscription){
			return;
		}
		this.subscription = subscribe(
			this.messageContext, 
			SELECTED_STUDENT_CHANNEL,
			(message) => {
				this.handleStudentChange(message)
			}
		);
	}

	disconnectedCallback() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}

	get name() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Name);
	}
	get description() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Description);
	}
	get phone() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Phone);
	}
	get email() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Email);
	}
	
	get errorMessages() {
		let errors = reduceErrors(this.wiredStudent.error);
		return errors.length ? errors : false;
	}

	get cardTitle() {
		let title = "Please select a student";
		if (this.wiredStudent.data) {
			title = this.name;
		} else if (this.wiredStudent.error) {
			title = "Something went wrong..."
		}
		return title;
	}

	handleStudentChange(message) {
		this.studentId = message.studentId;
	}
	
	_getDisplayValue(data, field) {
		return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
	}
	
}