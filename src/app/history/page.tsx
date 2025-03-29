'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Divider, Grid, Avatar, Chip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudIcon from '@mui/icons-material/Cloud';
import BrushIcon from '@mui/icons-material/Brush';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import NoFoodIcon from '@mui/icons-material/NoFood';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import PetsIcon from '@mui/icons-material/Pets';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function OurHistoryPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
        Our Team's Journey: From Faddergruppe to Real-time F1 Racing App
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          The Beginning: How Four Informatics Students Joined Forces
        </Typography>

        <Typography paragraph>
          It all started in the halls of the informatics department, where four students with vastly different backgrounds
          but a shared passion for technology would eventually create something extraordinary.
        </Typography>

        <Grid container spacing={4} sx={{ my: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#DC0000', mr: 2 }}>A</Avatar>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>Arne</Typography>
              <Chip
                icon={<NoFoodIcon />}
                label="Chips Hater"
                size="small"
                sx={{ ml: 2, backgroundColor: 'rgba(255,0,0,0.3)' }}
              />
            </Box>
            <Typography paragraph>
              <strong>Arne</strong> and <strong>Gard</strong> first met during their freshman orientation in the same faddergruppe.
              While other students were focused on the social aspects of university life, these two were already discussing the
              architectural merits of various web frameworks. Arne, known for his meticulous attention to detail and peculiar aversion
              to chips (which became apparent during late-night coding sessions when everyone else was snacking), quickly found a
              kindred spirit in Gard.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#0090FF', mr: 2 }}>G</Avatar>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>Gard</Typography>
              <Chip
                icon={<SportsBarIcon />}
                label="Coding Enthusiast"
                size="small"
                sx={{ ml: 2, backgroundColor: 'rgba(0,144,255,0.3)' }}
              />
            </Box>
            <Typography paragraph>
              Despite Gard's reputation for enjoying perhaps a bit too much of the student nightlife, his ability to produce
              remarkable code even after a night out was nothing short of impressive. Coming from the same faddergruppe as Arne,
              their collaboration began with small projects before evolving into something much bigger.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8700', mr: 2 }}>L</Avatar>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>Lars</Typography>
              <Chip
                icon={<TagFacesIcon />}
                label="Allergic to Everything"
                size="small"
                sx={{ ml: 2, backgroundColor: 'rgba(255,135,0,0.3)' }}
              />
            </Box>
            <Typography paragraph>
              <strong>Lars</strong> joined the duo during a mandatory algorithms course. His extensive knowledge of optimization
              techniques immediately caught their attention when he optimized a sorting algorithm that the professor had claimed
              couldn't be improved further. Lars came with his own unique challenge – severe allergies to nearly everything except
              peanuts, which meant team meetings required careful planning. But what he lacked in dietary freedom, he made up for
              with his extraordinary ability to write clean, fast, and efficient code.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#00D2BE', mr: 2 }}>O</Avatar>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>Ole</Typography>
              <Chip
                icon={<PetsIcon />}
                label="Mustache Legend"
                size="small"
                sx={{ ml: 2, backgroundColor: 'rgba(0,210,190,0.3)' }}
              />
            </Box>
            <Typography paragraph>
              <strong>Ole</strong>, the final piece of the puzzle, was initially just a friendly face they knew from the department.
              With his distinctive mustache (which had once been gently stroked by a professor who mistook it for a pet during a
              virtual lecture in the pandemic era), Ole had built a reputation as the go-to person for elegant UI solutions. It wasn't
              until they all ended up in the same advanced web development course that they realized Ole's expertise in frontend
              technologies perfectly complemented their collective skillset.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          The Perfect Storm of Skills
        </Typography>

        <Typography paragraph>
          The team's formation was almost inevitable given their complementary strengths:
        </Typography>

        <Grid container spacing={3} sx={{ my: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '1px solid rgba(220,0,0,0.5)',
              borderRadius: 2,
              height: '100%',
              backgroundColor: 'rgba(220,0,0,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon sx={{ mr: 2, color: '#DC0000' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Arne: The Smart Architect</Typography>
              </Box>
              <Typography>
                Backend architecture and database optimization. His ability to design systems that were both robust and
                scalable became the foundation of their projects. His mantra was always about building "smart" solutions
                rather than quick fixes.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '1px solid rgba(0,144,255,0.5)',
              borderRadius: 2,
              height: '100%',
              backgroundColor: 'rgba(0,144,255,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CloudIcon sx={{ mr: 2, color: '#0090FF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Gard: The Many APIs Master</Typography>
              </Box>
              <Typography>
                API integration and real-time data processing. Despite (or perhaps because of) his fondness for social
                lubrication, he had an uncanny ability to make disparate systems talk to each other seamlessly. He was
                known for delivering "many" endpoints in record time.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '1px solid rgba(255,135,0,0.5)',
              borderRadius: 2,
              height: '100%',
              backgroundColor: 'rgba(255,135,0,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon sx={{ mr: 2, color: '#FF8700' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Lars: The Fast Optimizer</Typography>
              </Box>
              <Typography>
                Algorithm design and performance optimization. His code was legendarily "fast," often improving application
                performance by orders of magnitude with seemingly minor tweaks. His allergy-induced focus (as he called it)
                let him see optimization opportunities others missed.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '1px solid rgba(0,210,190,0.5)',
              borderRadius: 2,
              height: '100%',
              backgroundColor: 'rgba(0,210,190,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BrushIcon sx={{ mr: 2, color: '#00D2BE' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Ole: The UI Wizard</Typography>
              </Box>
              <Typography>
                User experience and frontend development. His interfaces were intuitive yet powerful, with transitions
                so smooth they became a signature of the team's work. He brought a human touch to their technical prowess,
                and his mustache became an unexpected mascot for the team.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          The F1 Racing Dashboard Project
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <DirectionsCarIcon sx={{ fontSize: 80, color: 'red' }} />
        </Box>

        <Typography paragraph>
          The idea for their real-time F1 racing dashboard came during a particularly heated debate about whether
          formula one racing strategy was more about driver skill or data analysis. Gard, in what the others initially
          dismissed as post-social-event enthusiasm, suggested they could build a platform that would visualize real-time
          race data in a way that would make strategy decisions obvious even to casual fans.
        </Typography>

        <Typography paragraph>
          The project seemed ambitious, perhaps too ambitious for a team of four students. But each saw an opportunity
          to push their skills to the limit:
        </Typography>

        <Box sx={{ my: 3, pl: 2, borderLeft: '4px solid red' }}>
          <Typography paragraph>
            <strong>Arne</strong> designed a database schema that could efficiently store and retrieve historical race data
            while accommodating real-time updates.
          </Typography>

          <Typography paragraph>
            <strong>Gard</strong> integrated with the OpenF1 API, creating a robust middleware that could handle API rate
            limiting while ensuring their application always had the latest data.
          </Typography>

          <Typography paragraph>
            <strong>Lars</strong> developed a prediction algorithm that could estimate race outcomes based on current positions,
            tire wear, and historical performance on specific tracks.
          </Typography>

          <Typography paragraph>
            <strong>Ole</strong> crafted an interface that displayed complex race data in an intuitive, visually appealing manner,
            with his signature smooth transitions making position changes and strategy shifts immediately apparent.
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          The Technical Stack
        </Typography>

        <Typography paragraph>
          They chose Next.js as their framework for several compelling reasons:
        </Typography>

        <Box sx={{ my: 3, pl: 3 }}>
          <Typography paragraph>
            <strong>1. Server-side rendering</strong> was crucial for their SEO strategy, as they wanted race information to be discoverable
          </Typography>

          <Typography paragraph>
            <strong>2. API routes</strong> simplified their backend implementation, allowing them to create secure endpoints for data processing
          </Typography>

          <Typography paragraph>
            <strong>3. React's component model</strong> was perfect for the modular UI they envisioned, with reusable elements for
            driver cards, race statistics, and track visualization
          </Typography>

          <Typography paragraph>
            <strong>4. Incremental Static Regeneration</strong> let them update race data without rebuilding the entire application
          </Typography>
        </Box>

        <Typography paragraph>
          The application architecture followed a clean separation of concerns:
        </Typography>

        <Box sx={{ my: 3, pl: 2, borderLeft: '4px solid white' }}>
          <Typography paragraph>
            <strong>Data Layer</strong>: API routes handled communication with the OpenF1 API, implementing caching, rate limiting, and data transformation
          </Typography>

          <Typography paragraph>
            <strong>Application Layer</strong>: Server components processed the data, performed calculations, and prepared it for display
          </Typography>

          <Typography paragraph>
            <strong>Presentation Layer</strong>: Client components handled user interactions and real-time updates through WebSockets
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          The Challenges
        </Typography>

        <Typography paragraph>
          The project wasn't without its challenges:
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography paragraph sx={{ p: 2, backgroundColor: 'rgba(220,0,0,0.1)', borderRadius: 1, mb: 2 }}>
            During one particularly intense development session, <strong>Arne</strong> had to ban all chips from the room,
            leading to a snack crisis that was only resolved when Lars discovered a local shop selling his safe peanut-based alternatives.
          </Typography>

          <Typography paragraph sx={{ p: 2, backgroundColor: 'rgba(0,144,255,0.1)', borderRadius: 1, mb: 2 }}>
            The team nearly lost a critical algorithm when <strong>Gard's</strong> laptop crashed after a particularly enthusiastic
            celebration of a successful API integration. Thankfully, their rigorous git commit practices saved the day.
          </Typography>

          <Typography paragraph sx={{ p: 2, backgroundColor: 'rgba(255,135,0,0.1)', borderRadius: 1, mb: 2 }}>
            <strong>Lars</strong> once had to code wearing gloves and a mask after discovering that the new keyboard
            they'd purchased contained trace elements he was allergic to.
          </Typography>

          <Typography paragraph sx={{ p: 2, backgroundColor: 'rgba(0,210,190,0.1)', borderRadius: 1 }}>
            <strong>Ole's</strong> mustache became unexpectedly famous when it appeared in a tech blog screenshot of their application,
            leading to a brief but entertaining Twitter moment about "the developer with the magnificent handlebar."
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          The Result
        </Typography>

        <Typography paragraph>
          Their F1 Dashboard eventually grew from a university project to a platform used by thousands of racing enthusiasts.
          The key features that set it apart were:
        </Typography>

        <Grid container spacing={2} sx={{ my: 3 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Real-time position updates</Typography>
              <Typography>
                With visually satisfying animations that made race progress intuitive and engaging to watch
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Dynamic driver cards</Typography>
              <Typography>
                Showing comprehensive stats that adjusted dynamically as the race progressed
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Predictive strategy analysis</Typography>
              <Typography>
                Helping fans understand the implications of tire changes and fuel consumption
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Historical comparisons</Typography>
              <Typography>
                Contextualizing current performance against past races at the same track
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          The Legacy
        </Typography>

        <Typography paragraph>
          Today, the four continue to maintain and improve the dashboard while pursuing their separate professional journeys.
          The project stands as a testament to how four very different individuals with complementary skills and a shared passion
          can create something greater than the sum of its parts.
        </Typography>

        <Typography paragraph>
          Arne still won't allow chips near his workstation, Lars has expanded his safe food list marginally to include certain
          types of rice, Ole's mustache has its own fan page, and Gard has slightly moderated his social activities – though he
          insists that some of his best code still comes after a night out with friends.
        </Typography>

        <Typography paragraph>
          What began in a faddergruppe has evolved into a lasting collaboration that continues to push the boundaries of what's
          possible with real-time data visualization in the world of F1 racing.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Avatar sx={{ bgcolor: '#DC0000' }}>A</Avatar>
            </Grid>
            <Grid item>
              <Avatar sx={{ bgcolor: '#0090FF' }}>G</Avatar>
            </Grid>
            <Grid item>
              <Avatar sx={{ bgcolor: '#FF8700' }}>L</Avatar>
            </Grid>
            <Grid item>
              <Avatar sx={{ bgcolor: '#00D2BE' }}>O</Avatar>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
