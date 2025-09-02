import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { NotificationsService } from '../notifications/notifications.service';
import { MatchesService } from '../matches/matches.service';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmail() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Get the notifications service
  const notificationsService = app.get(NotificationsService);
  const matchesService = app.get(MatchesService);
  
  try {
    // Try to rebuild matches for a project to ensure we have matches
    console.log('Rebuilding matches for project 1...');
    const rebuiltMatches = await matchesService.rebuildMatches(1);
    
    if (!rebuiltMatches || rebuiltMatches.length === 0) {
      console.log('No matches found or created for project 1');
      return;
    }
    
    const match = rebuiltMatches[0];
    
    // Get the associated project and client using the matches service
    const project = await matchesService['projectsRepository'].findOne({
      where: { id: match.project_id },
      relations: ['client']
    });
    
    if (!project) {
      console.log('Project not found for match');
      return;
    }
    
    console.log('Sending test email notification...');
    console.log('Match score:', match.score);
    console.log('Project country:', project.country);
    console.log('Client email:', project.client.email);
    
    // Send the enhanced notification
    await notificationsService.sendHighScoreMatchNotification(
      match,
      project,
      project.client
    );
    
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Error sending test email:', error);
  } finally {
    await app.close();
  }
}

testEmail().catch(error => {
  console.error('Error in test email script:', error);
  process.exit(1);
});