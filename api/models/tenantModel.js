class TenantModel{
  constructor(name) {
    this.name = name;
    this.topics = [];
  }
  SetTopic(topics) {
    let sortedTopic = topics.filter((i)=>!this.topic.includes(i))
    this.topics.push(sortedTopic);
  }
  RemoveTopic(topics) {
    this.topics = this.topic.filter((i)=>!topics.includes(i));
  }
}

module.exports = TenantModel;