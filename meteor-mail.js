Mails = new Mongo.Collection("mails");

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        folders: function () {
            return Mails.find({});
        }
    });

    Template.task.events({
        "click .toggle-checked": function () {
            // Set the checked property to the opposite of its current value
            Tasks.update(this._id, {$set: {checked: !this.checked}});
        },
        "click .delete": function () {
            Mails.remove(this._id);
        }
    });
}