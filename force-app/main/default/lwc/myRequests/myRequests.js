import { LightningElement, track, wire } from 'lwc';
import leaveApproveReq from '@salesforce/apex/leaveTrackerController.leaveApproveReq'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import LEAVE_REQUEST from '@salesforce/schema/LeaveRequest__c'
import LEAVE_REQUEST_NAME from '@salesforce/schema/LeaveRequest__c.Name'
import LEAVE_REQUEST_FROM_DATE from '@salesforce/schema/LeaveRequest__c.From_Date__c'
import LEAVE_REQUEST_To_DATE from '@salesforce/schema/LeaveRequest__c.To_Date__c'
import LEAVE_REQUEST_Reason from '@salesforce/schema/LeaveRequest__c.Reason__c'
import LEAVE_REQUEST_USER from '@salesforce/schema/LeaveRequest__c.User__c'
import LEAVE_REQUEST_Status from '@salesforce/schema/LeaveRequest__c.Status__c'
import LEAVE_REQUEST_MANAGER_COMMENTS from '@salesforce/schema/LeaveRequest__c.Manager_Comment__c'

import Id from '@salesforce/user/Id'
import {refreshApex} from '@salesforce/apex'




const columns = [
    {label:"Name",fieldName:'Name', cellAttributes: { class: {fieldName : 'cellClass'}}},
    {label:"From",fieldName:'From_Date__c', cellAttributes: { class: {fieldName : 'cellClass'}}},
    {label:"To Date",fieldName:'To_Date__c', cellAttributes: { class: {fieldName : 'cellClass'}}},
    {label:"Manager Comment",fieldName:'Manager_Comment__c', cellAttributes: { class: {fieldName : 'cellClass'}}},
    {label:"Reason",fieldName:'Reason__c', cellAttributes: { class: {fieldName : 'cellClass'}}},
    {label:"Status",fieldName:'Status__c', cellAttributes: { class: {fieldName : 'cellClass'}}},
    {
        type:'button',typeAttributes:{
            label:'Edit',
            name:'Edit',
            value:'Edit',
            disabled: {fieldName : 'isEditDisabled'}

        }, cellAttributes: { class: {fieldName : 'cellClass'}}
    }
    
]
export default class MyRequests extends LightningElement {

    leavesData = []
    leavesDataDetail

    columns = columns
    showLeavePop = false;
    objectApiName = LEAVE_REQUEST
    recordId 
    nameField = LEAVE_REQUEST_NAME
    FromDate=LEAVE_REQUEST_FROM_DATE
    rasonField=LEAVE_REQUEST_Reason
    ToDateField=LEAVE_REQUEST_To_DATE
    userField=LEAVE_REQUEST_USER
    currentUserId = Id
    statusield = LEAVE_REQUEST_Status
    managerCommentsField = LEAVE_REQUEST_MANAGER_COMMENTS


   @wire(leaveApproveReq)
    wiredLeaves({ error, data }) {
        this.leavesDataDetail = data
        if (data) {
            this.leavesData = data.map( a =>({
                ...a,
                cellClass : a.Status__c == 'Approved' ? 'slds-theme_success' : a.Status__c == 'Rejected' ? 'slds-theme_warning':'',
                isEditDisabled : a.Status__c != 'Pending'

            }))
            console.log(this.leavesData);
        } else if (error) {
            console.error('Error fetching leaves:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error fetching leave data.',
                    variant: 'error',
                })
            );
        }
    }

    // connectedCallback(){

    //     getMyLeaves()
    //     .then(res =>{
    //         this.leavesData = res
    //     })
    //     .catch(error =>{
    //         console.error(error);
            
    //     })
    // }

    get noRecords(){

        return this.leavesData.length == 0
    }

    popupCloseHandler(event){
        this.showLeavePop=false

    }

    rowactionHandler(event){
        this.showLeavePop = true
        this.recordId = event.detail.row.Id
    }

    successHandler(event){
        this.showLeavePop = false
        refreshApex(this.leavesDataDetail)

        this.dispatchEvent(
            new ShowToastEvent({
                title : 'Success',
                message : 'Data Updated Succcessfully',
                variant : 'success'
            })
        )

    }



    newLeaveHandler(){
        this.recordId = ''
        this.showLeavePop= true
    }

}
