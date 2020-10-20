 const list = document.querySelector('ul');
 const form = document.querySelector('form');

 const addNote = (recipe, id) => {
    let time = recipe.created_at.toDate();
     let html = `
     <li data-id="${id}">
     <div>${recipe.title}</div>
     <div>${recipe.body}</div>
     <div>${recipe.important}</div>
     <div>${time}</div>
     <button class="btn btn-danger btn-sm my-2">delete</button>
     </li>`;
    

        list.innerHTML += html;
    
    }

    

    const deleteNote = (id) => {
        const notes = document.querySelectorAll('li');
        notes.forEach(note => {
            if(note.getAttribute('data-id') === id){
                note.remove();
            }
        });
    }

//Get Documents
db.collection('NoteApp').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if(change.type === 'added'){
            addNote(doc.data(), doc.id);
        } else if(change.type === 'removed'){
            deleteNote(doc.id);

        }
    });
});

//Add documents
form.addEventListener('submit', e => {
    e.preventDefault();

    const now = new Date();
    const recipe = {
        title: form.recipe.value,
        body: form.body.value,
        important: form.important.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)

    };

    
    db.collection('NoteApp').add(recipe).then(() => {
        console.log('Note added');
    }).catch(err => {
        console.log(err);
    })

});

//Deleting documents
list.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
        const id  = e.target.parentElement.getAttribute('data-id');
        console.log(id);
        db.collection('NoteApp').doc(id).delete().then(() => {
            console.log('Note deleted');
        });
    }

    function add_task(){
        input_box = document.getElementById("input_box");
        input_date = document.getElementById("input_date");
    
        if(input_box.value.length != 0 && input_date.value.length != 0){
          // our boxes have data and we take database
          var key = firebase.database().ref().child("unfinished_task").push().key;
          var task = {
            title: input_box.value,
            date: input_date.value,
            key: key
          };
    
          var updates = {};
          updates["/unfinished_task/" + key] = task;
          firebase.database().ref().update(updates);
          create_unfinished_task();
        }
      }
    
      function create_unfinished_task(){
        unfinished_task_container = document.getElementsByClassName("container")[0];
        unfinished_task_container.innerHTML = "";
    
        task_array = [];
        firebase.database().ref("unfinished_task").once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            task_array.push(Object.values(childData));
          });
          for(var i, i = 0; i < task_array.length; i++){
            task_date = task_array[i][0];
            task_key = task_array[i][1];
            task_title = task_array[i][2];
    
            task_container = document.createElement("div");
            task_container.setAttribute("class", "task_container");
            task_container.setAttribute("data-key", task_key);
    
            // TASK DATA
            task_data = document.createElement('div');
            task_data.setAttribute('id', 'task_data');
    
            title = document.createElement('p');
            title.setAttribute('id', 'task_title');
            title.setAttribute('contenteditable', false);
            title.innerHTML = task_title;
    
            date = document.createElement('p');
            date.setAttribute('id', 'task_date');
            date.setAttribute('contenteditable', false);
            date.innerHTML = task_date;
    
            // TASK TOOLS
            task_tool = document.createElement('div');
            task_tool.setAttribute('id', 'task_tool');
    
            task_done_button = document.createElement('button');
            task_done_button.setAttribute('id', 'task_done_button');
            task_done_button.setAttribute('onclick', "task_done(this.parentElement.parentElement, this.parentElement)");
            fa_done = document.createElement('i');
            fa_done.setAttribute('class', 'fa fa-check');
    
            task_edit_button = document.createElement('button');
            task_edit_button.setAttribute('id', 'task_edit_button');
            task_edit_button.setAttribute('onclick', "task_edit(this.parentElement.parentElement, this)");
            fa_edit = document.createElement('i');
            fa_edit.setAttribute('class', 'fa fa-pencil');
    
            task_delete_button = document.createElement('button');
            task_delete_button.setAttribute('id', 'task_delete_button');
            task_delete_button.setAttribute('onclick', "task_delete(this.parentElement.parentElement)");
            fa_delete = document.createElement('i');
            fa_delete.setAttribute('class', 'fa fa-trash');
    
    
            unfinished_task_container.append(task_container);
            task_container.append(task_data);
            task_data.append(title);
            task_data.append(date);
    
            task_container.append(task_tool);
            task_tool.append(task_done_button);
            task_done_button.append(fa_done);
            task_tool.append(task_edit_button);
            task_edit_button.append(fa_edit);
            task_tool.append(task_delete_button);
            task_delete_button.append(fa_delete);
          }
    
        });
    
      }
      function create_finished_task(){
    
        finished_task_container = document.getElementsByClassName("container")[1];
        finished_task_container.innerHTML = "";
    
        finished_task_array = [];
        firebase.database().ref("finished_task").once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            finished_task_array.push(Object.values(childData));
          });
          for(var i, i = 0; i < finished_task_array.length; i++){
            task_date = finished_task_array[i][0];
            task_key = finished_task_array[i][1];
            task_title = finished_task_array[i][2];
    
            task_container = document.createElement("div");
            task_container.setAttribute("class", "task_container");
            task_container.setAttribute("data-key", task_key);
    
            // TASK DATA
            task_data = document.createElement('div');
            task_data.setAttribute('id', 'task_data');
    
            title = document.createElement('p');
            title.setAttribute('id', 'task_title');
            title.setAttribute('contenteditable', false);
            title.innerHTML = task_title;
    
            date = document.createElement('p');
            date.setAttribute('id', 'task_date');
            date.setAttribute('contenteditable', false);
            date.innerHTML = task_date;
    
            // TASK TOOLS
            task_tool = document.createElement('div');
            task_tool.setAttribute('id', 'task_tool');
    
            task_delete_button = document.createElement('button');
            task_delete_button.setAttribute('id', 'task_delete_button');
            task_delete_button.setAttribute('onclick', "task_finished_delete(this.parentElement.parentElement)");
            fa_delete = document.createElement('i');
            fa_delete.setAttribute('class', 'fa fa-trash');
    
            finished_task_container.append(task_container);
            task_container.append(task_data);
            task_data.append(title);
            task_data.append(date);
    
            task_container.append(task_tool);
            task_tool.append(task_delete_button);
            task_delete_button.append(fa_delete);
          }
    
        });
    
      }
    
      function task_done(task, task_tool){
        finished_task_container = document.getElementsByClassName("container")[1];
        task.removeChild(task_tool);
        finished_task_container.append(task);
    
        var key = task.getAttribute("data-key");
        var task_obj = {
          title: task.childNodes[0].childNodes[0].innerHTML,
          date: task.childNodes[0].childNodes[1].innerHTML,
          key: key
        };
    
        var updates = {};
        updates["/finished_task/" + key] = task_obj;
        firebase.database().ref().update(updates);
    
        // delete our task from unfinished
        task_delete(task);
        create_finished_task();
      }
    
      function task_edit(task, edit_button){
        edit_button.setAttribute("id", "task_edit_button_editing");
        edit_button.setAttribute("onclick", "finish_edit(this.parentElement.parentElement, this)");
    
        title = task.childNodes[0].childNodes[0];
        title.setAttribute("contenteditable", true);
        title.setAttribute("id", "title_editing");
        title.focus();
    
        date = task.childNodes[0].childNodes[1];
        date.setAttribute("contenteditable", true);
        date.setAttribute("id", "date_editing");
    
      }
      function finish_edit(task, edit_button){
        edit_button.setAttribute("id", "task_edit_button");
        edit_button.setAttribute("onclick", "task_edit(this.parentElement.parentElement, this)");
    
        title = task.childNodes[0].childNodes[0];
        title.setAttribute("contenteditable", false);
        title.setAttribute("id", "task_title");
    
        date = task.childNodes[0].childNodes[1];
        date.setAttribute("contenteditable", false);
        date.setAttribute("id", "task_date");
    
        // change in firebase to
        var key = task.getAttribute("data-key");
        var task_obj = {
          title: task.childNodes[0].childNodes[0].innerHTML,
          date: task.childNodes[0].childNodes[1].innerHTML,
          key: key
        };
    
        var updates = {};
        updates["/unfinished_task/" + key] = task_obj;
        firebase.database().ref().update(updates);
    
      }
    
      function task_delete(task){
        key = task.getAttribute("data-key");
        task_to_remove = firebase.database().ref("unfinished_task/" + key);
        task_to_remove.remove();
    
        // remove from html view or whatevesss
        task.remove();
    
      }
    
      function task_finished_delete(task){
        key = task.getAttribute("data-key");
        task_to_remove = firebase.database().ref("finished_task/" + key);
        task_to_remove.remove();
    
        // remove from html view or whatevesss
        task.remove();
    
      }
});