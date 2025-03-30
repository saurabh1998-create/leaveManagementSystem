public with sharing class leaveTrackerController {
    
    @AuraEnabled(cacheable=true)
    public static list<LeaveRequest__c> getMyLeaves(){
        try {

            list<LeaveRequest__c> myleaves = new list<LeaveRequest__c>();
            myleaves = [select Name , From_Date__c , Manager_Comment__c , Reason__c , Status__c , To_Date__c , User__c from LeaveRequest__c where User__c =: UserInfo.getUserId() Order by createdDate DESC];
            System.debug(myleaves);
            return myleaves;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}