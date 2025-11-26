// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OnboardingRegistry
 * @notice Registry for user onboarding progress and milestones
 * Tracks onboarding steps, completion status, and milestones
 */
contract OnboardingRegistry is Ownable {
    mapping(address => OnboardingProgress) public progress;
    mapping(uint256 => Milestone) public milestones;
    uint256 private _milestoneCounter;

    struct OnboardingProgress {
        address user;
        uint256 currentStep;
        uint256 completedSteps;
        bool isComplete;
        uint256 startedAt;
        uint256 completedAt;
        mapping(uint256 => bool) stepCompleted; // stepId => completed
    }

    struct Milestone {
        uint256 id;
        string name;
        string description;
        uint256 stepId;
        bool isActive;
    }

    event OnboardingStarted(address indexed user);
    event StepCompleted(address indexed user, uint256 stepId);
    event OnboardingCompleted(address indexed user);
    event MilestoneCreated(uint256 indexed milestoneId, string name);

    constructor() Ownable(msg.sender) {
        // Initialize default milestones
        createMilestone("Welcome", "Welcome to DreamNet", 0);
        createMilestone("Passport", "Mint your Dream Passport", 1);
        createMilestone("First Dream", "Create your first dream", 2);
        createMilestone("Explore", "Explore the network", 3);
    }

    /**
     * @notice Start onboarding for a user
     */
    function startOnboarding() public {
        OnboardingProgress storage prog = progress[msg.sender];
        require(prog.startedAt == 0, "Onboarding already started");
        
        prog.user = msg.sender;
        prog.currentStep = 0;
        prog.completedSteps = 0;
        prog.isComplete = false;
        prog.startedAt = block.timestamp;
        
        emit OnboardingStarted(msg.sender);
    }

    /**
     * @notice Complete a step
     */
    function completeStep(uint256 stepId) public {
        OnboardingProgress storage prog = progress[msg.sender];
        require(prog.startedAt > 0, "Onboarding not started");
        require(!prog.isComplete, "Onboarding already complete");
        require(!prog.stepCompleted[stepId], "Step already completed");

        prog.stepCompleted[stepId] = true;
        prog.completedSteps++;
        prog.currentStep = stepId + 1;

        emit StepCompleted(msg.sender, stepId);

        // Check if all steps are complete (assuming 4 default steps)
        if (prog.completedSteps >= 4) {
            prog.isComplete = true;
            prog.completedAt = block.timestamp;
            emit OnboardingCompleted(msg.sender);
        }
    }

    /**
     * @notice Create a milestone (owner only)
     */
    function createMilestone(
        string memory name,
        string memory description,
        uint256 stepId
    ) public onlyOwner returns (uint256) {
        uint256 id = _milestoneCounter;
        _milestoneCounter++;

        milestones[id] = Milestone({
            id: id,
            name: name,
            description: description,
            stepId: stepId,
            isActive: true
        });

        emit MilestoneCreated(id, name);
        return id;
    }

    /**
     * @notice Get onboarding progress for a user
     */
    function getProgress(address user) public view returns (
        uint256 currentStep,
        uint256 completedSteps,
        bool isComplete,
        uint256 startedAt,
        uint256 completedAt
    ) {
        OnboardingProgress storage prog = progress[user];
        return (
            prog.currentStep,
            prog.completedSteps,
            prog.isComplete,
            prog.startedAt,
            prog.completedAt
        );
    }

    /**
     * @notice Check if a step is completed
     */
    function isStepCompleted(address user, uint256 stepId) public view returns (bool) {
        return progress[user].stepCompleted[stepId];
    }
}

