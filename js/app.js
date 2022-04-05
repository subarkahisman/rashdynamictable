var StudentModel = Backbone.Model.extend({
	defaults: {
		firstName: '',
		lastName: '',
		address: ''
	}
});

var StudentsCollection = Backbone.Collection.extend({});

var studentsCollection = new StudentsCollection();

var StudentView = Backbone.View.extend({
	model: new StudentModel(),
	tagName: 'tr',
	initialize: function() {
		this.template = _.template($('.students-list-template').html());
	},
	cancel: function () {
		studentsView.render();
	},
	delete: function () {
		this.model.destroy();
	},
	edit: function () {
		$('.edit-student').hide();
		$('.delete-student').hide();
		this.$('.update-student').show();
		this.$('.cancel-student').show();

		var firstName = this.$('.firstName').html();
		var lastName = this.$('.lastName').html();
		var address = this.$('.address').html();

		this.$('.firstName').html('<input type="text" class="form-control firstName-update" value="' + firstName + '">');
		this.$('.lastName').html('<input type="text" class="form-control lastName-update" value="' + lastName + '">');
		this.$('.address').html('<input type="text" class="form-control address-update" value="' + address + '">');
	},
	
	events: {
		'click .edit-student': 'edit',
		'click .update-student': 'update',
		'click .cancel-student': 'cancel',
		'click .delete-student': 'delete'	
	},
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	update: function () {
		this.model.set('firstName', $('.firstName-update').val());
		this.model.set('lastName', $('.lastName-update').val());
		this.model.set('address', $('.address-update').val());
	}
});

var StudentsView = Backbone.View.extend({
	model: studentsCollection,
	el: $('.students-list'),
	initialize: function() {
		var that = this;
		this.model.on('add', this.render, this);
		this.model.on('change',function() {
			setTimeout(function() {
				that.render();
			},40);												
		}, this );
		this.model.on('remove', this.render, this);
	},
	
	render: function() {
		var that = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(student) {
			that.$el.append((new StudentView({model: student})).render().$el);
		});
		return this;
	}
});

var studentsView = new StudentsView();

$(document).ready(function() {
	$('.add-student').on('click', function() {
		var student = new StudentModel({
			firstName: $('.firstName-input').val(),
			lastName: $('.lastName-input').val(),
			address: $('.address-input').val()
		});
		$('.firstName-input').val('');
		$('.lastName-input').val('');
		$('.address-input').val('');
		console.log(student.toJSON());
		studentsCollection.add(student);
	})
})
