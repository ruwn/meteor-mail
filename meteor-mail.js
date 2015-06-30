Mails = new Mongo.Collection("mails");

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        folders: function () {
            var data = Mails.find().fetch();
            var distinctData = _.uniq(data, false, function(d) {return d.folder});
            return _.pluck(distinctData, "folder");
        }
    });

    Template.folder.events({
        "click .toggle-checked": function () {
            // Set the checked property to the opposite of its current value
            Tasks.update(this._id, {$set: {checked: !this.checked}});
        },
        "click .delete": function (e) {
            var folderName = event.target.value;
            console.log(".delete");
            console.log(folderName);

        }
    });
}