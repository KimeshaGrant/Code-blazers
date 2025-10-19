from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)  # For login
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    
    # Anonymous display name - what others see
    display_name = db.Column(db.String(80), unique=True, nullable=False)
    
    # Optional profile info (not shown to others by default)
    name = db.Column(db.String(80))
    photo = db.Column(db.String(120))
    
    # Account settings
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    is_moderator = db.Column(db.Boolean, default=False)
    is_banned = db.Column(db.Boolean, default=False)
    ban_reason = db.Column(db.Text)
    
    # Relationships
    group_memberships = db.relationship('GroupMembership', back_populates='user', cascade='all, delete-orphan')
    sent_messages = db.relationship('Message', back_populates='sender', foreign_keys='Message.sender_id')
    sent_dms = db.relationship('DirectMessage', back_populates='sender', foreign_keys='DirectMessage.sender_id')
    received_dms = db.relationship('DirectMessage', back_populates='recipient', foreign_keys='DirectMessage.recipient_id')
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def generate_anonymous_name(self):
        """Generate a unique anonymous display name"""
        if not self.display_name:
            adjectives = ['Kind', 'Brave', 'Strong', 'Gentle', 'Caring', 'Hopeful', 
                         'Peaceful', 'Calm', 'Wise', 'Bright']
            nouns = ['Soul', 'Heart', 'Spirit', 'Friend', 'Star', 'Light', 
                    'Voice', 'Journey', 'Path', 'Hope']
            
            import random
            base_name = f"{random.choice(adjectives)}{random.choice(nouns)}"
            random_suffix = uuid.uuid4().hex[:4]
            self.display_name = f"{base_name}{random_suffix}"
    
    def __repr__(self):
        return f'<User {self.display_name}>'


class SupportGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    # Group settings
    is_private = db.Column(db.Boolean, default=False)
    requires_approval = db.Column(db.Boolean, default=True)
    max_members = db.Column(db.Integer, default=100)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    created_by = db.relationship('User', foreign_keys=[created_by_id])
    memberships = db.relationship('GroupMembership', back_populates='group', cascade='all, delete-orphan')
    messages = db.relationship('Message', back_populates='group', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<SupportGroup {self.name}>'


class GroupMembership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('support_group.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    is_moderator = db.Column(db.Boolean, default=False)
    notifications_enabled = db.Column(db.Boolean, default=True)
    
    # Relationships
    user = db.relationship('User', back_populates='group_memberships')
    group = db.relationship('SupportGroup', back_populates='memberships')
    
    # Ensure user can only join a group once
    __table_args__ = (db.UniqueConstraint('user_id', 'group_id', name='unique_membership'),)
    
    def __repr__(self):
        return f'<Membership User:{self.user_id} Group:{self.group_id}>'


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('support_group.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    edited_at = db.Column(db.DateTime)
    
    # Threading support
    parent_message_id = db.Column(db.Integer, db.ForeignKey('message.id'))
    
    # Status flags
    is_deleted = db.Column(db.Boolean, default=False)
    deleted_at = db.Column(db.DateTime)
    is_flagged = db.Column(db.Boolean, default=False)
    flagged_reason = db.Column(db.Text)
    
    # Relationships
    group = db.relationship('SupportGroup', back_populates='messages')
    sender = db.relationship('User', back_populates='sent_messages')
    parent_message = db.relationship('Message', remote_side=[id], backref='replies')
    reactions = db.relationship('MessageReaction', back_populates='message', cascade='all, delete-orphan')
    reports = db.relationship('Report', back_populates='reported_message', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Message {self.id} by User:{self.sender_id}>'


class DirectMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Status
    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime)
    is_deleted_by_sender = db.Column(db.Boolean, default=False)
    is_deleted_by_recipient = db.Column(db.Boolean, default=False)
    
    # Relationships
    sender = db.relationship('User', foreign_keys=[sender_id], back_populates='sent_dms')
    recipient = db.relationship('User', foreign_keys=[recipient_id], back_populates='received_dms')
    
    def __repr__(self):
        return f'<DirectMessage {self.id} from User:{self.sender_id}>'


class MessageReaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('message.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reaction_type = db.Column(db.String(20), nullable=False)  # support, hug, heart, strength
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    message = db.relationship('Message', back_populates='reactions')
    user = db.relationship('User')
    
    # User can only react once per type per message
    __table_args__ = (db.UniqueConstraint('message_id', 'user_id', 'reaction_type', name='unique_reaction'),)
    
    def __repr__(self):
        return f'<Reaction {self.reaction_type} by User:{self.user_id}>'


class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    reason = db.Column(db.Text, nullable=False)
    
    # What's being reported
    reported_message_id = db.Column(db.Integer, db.ForeignKey('message.id'))
    reported_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    # Status
    status = db.Column(db.String(20), default='pending')  # pending, reviewed, action_taken, dismissed
    reviewed_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    reviewed_at = db.Column(db.DateTime)
    moderator_notes = db.Column(db.Text)
    
    # Relationships
    reporter = db.relationship('User', foreign_keys=[reporter_id])
    reported_message = db.relationship('Message', back_populates='reports')
    reported_user = db.relationship('User', foreign_keys=[reported_user_id])
    reviewed_by = db.relationship('User', foreign_keys=[reviewed_by_id])
    
    def __repr__(self):
        return f'<Report {self.id} - {self.status}>'


class UserBlock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blocker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    blocked_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    blocker = db.relationship('User', foreign_keys=[blocker_id])
    blocked = db.relationship('User', foreign_keys=[blocked_id])
    
    # Ensure unique blocks
    __table_args__ = (db.UniqueConstraint('blocker_id', 'blocked_id', name='unique_block'),)
    
    def __repr__(self):
        return f'<Block User:{self.blocker_id} blocked User:{self.blocked_id}>'

# from . import db
# from werkzeug.security import generate_password_hash
# from datetime import datetime

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True)
#     name = db.Column(db.String(80))
#     password = db.Column(db.String(200))
#     email = db.Column(db.String(120))
#     photo = db.Column(db.String(120))
#     date_joined = db.Column(db.DateTime, default=datetime.now)

# class Messages(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id_fk = db.Column(db.Integer, db.ForeignKey('user.id')) 
#     message = db.Column(db.String(1000))
#     timestamp = db.Column(db.DateTime, default=datetime.now)
