public with sharing class StudentBrowser {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getStudents(String instructorId,
    String courseDeliveryId) {
        String query = '';
		String scheckStatus = 'Status__c IN (\'Enrolled\', \'Completed\') ';

		query += 'SELECT Id, Name, Email, Phone, Title, Account.Name, PhotoUrl FROM Contact ';
		if (String.isNotEmpty(courseDeliveryId)) {
			query += 'WHERE Id IN (SELECT Student__c FROM course_attendee__c WHERE course_delivery__c = :courseDeliveryId AND ' + scheckStatus + ') ';
		} else if (String.isNotEmpty(instructorId)) {
			query += 'WHERE Id IN (SELECT Student__c FROM course_attendee__c WHERE course_delivery__r.Instructor__c = :instructorId AND ' + scheckStatus + ') ';
		}
		query += 'WITH SECURITY_ENFORCED ';
		query += 'ORDER BY Name';

		return Database.query(query);
    }
}