public with sharing class CourseDeliveryLocations {
    @AuraEnabled(cacheable=true)
	public static List<AggregateResult> getLocations() {
		return [SELECT City__c, Country__c, COUNT(Id) numDeliveries FROM Course_Delivery__c WITH SECURITY_ENFORCED group by City__c, Country__c];
	}
}
